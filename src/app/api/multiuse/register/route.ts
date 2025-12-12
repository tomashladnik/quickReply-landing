import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, phone, email, type, token } = body;

    // Validate required fields
    if (!name || !dateOfBirth || !phone || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);
    if (dob >= new Date()) {
      return NextResponse.json(
        { error: 'Date of birth must be in the past' },
        { status: 400 }
      );
    }

    // Create a MultiuseScan record for this registration
    console.log('Registration API: Creating database record with data:', {
      patientName: name.trim(),
      patientPhone: phone.trim(),
      flowType: type,
      email: email ? email.trim() : null
    });
    
    const scan = await prisma.multiuseScan.create({
      data: {
        patientName: name.trim(),
        patientPhone: phone.trim(),
        flowType: type, // 'gym' or 'charity'
        status: 'pending',
        demoScanId: token || null,
        originalJson: {
          name: name.trim(),
          dateOfBirth,
          phone: phone.trim(),
          email: email ? email.trim() : null,
          type,
          registrationDate: new Date().toISOString()
        }
      }
    });

    console.log('Registration API: Database record created successfully:', {
      id: scan.id,
      name: scan.patientName,
      flowType: scan.flowType
    });

    return NextResponse.json({
      success: true,
      id: scan.id,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}