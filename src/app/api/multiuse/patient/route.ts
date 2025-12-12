import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUniqueShortCode } from '@/lib/shortcode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scanId, flow, fullName, phone, email, dateOfBirth } = body;

    if (!flow || !fullName || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "flow, fullName, and phone are required",
        },
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

    // Validate date of birth if provided
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (dob >= new Date()) {
        return NextResponse.json(
          { error: 'Date of birth must be in the past' },
          { status: 400 }
        );
      }
    }

    // Generate a unique short code for the result link
    const shortCode = await generateUniqueShortCode();

    // Create a MultiuseScan record for this registration
    console.log('Patient API: Creating database record with data:', {
      patientName: fullName.trim(),
      patientPhone: phone.trim(),
      flowType: flow,
      email: email ? email.trim() : null,
      shortCode
    });
    
    const scan = await prisma.$executeRaw`
      INSERT INTO multiuse_scans_demo (
        "shortCode", patient_name, patient_phone, flow_type, status, demo_scan_id, original_json, created_at, updated_at
      ) VALUES (
        ${shortCode}, ${fullName.trim()}, ${phone.trim()}, ${flow}, 'pending', 
        ${scanId || null}, 
        ${JSON.stringify({
          name: fullName.trim(),
          dateOfBirth: dateOfBirth || null,
          phone: phone.trim(),
          email: email ? email.trim() : null,
          type: flow,
          registrationDate: new Date().toISOString()
        })}::jsonb,
        NOW(), NOW()
      )
    `;

    // Get the created scan for response
    const createdScan = await prisma.$queryRaw<{
      id: string;
      patient_name: string;
      flow_type: string;
      shortCode: string;
    }[]>`
      SELECT id, patient_name, flow_type, "shortCode"
      FROM multiuse_scans_demo
      WHERE "shortCode" = ${shortCode}
      LIMIT 1
    `;

    const scanResult = createdScan[0];

    console.log('Patient API: Database record created successfully:', {
      id: scanResult.id,
      name: scanResult.patient_name,
      flowType: scanResult.flow_type,
      shortCode: scanResult.shortCode
    });

    return NextResponse.json(
      {
        success: true,
        id: scanResult.id,
        scanId: scanResult.id,
        shortCode: scanResult.shortCode,
        message: 'Registration successful'
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("multiuse/patient error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
