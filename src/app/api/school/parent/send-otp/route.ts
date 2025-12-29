import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create parent by email or phone
    let parent = null;
    if (email) {
      parent = await prisma.parent.findUnique({
        where: { email },
      });
    } else if (phone) {
      parent = await prisma.parent.findFirst({
        where: { phone },
      });
    }

    if (parent) {
      // Update OTP
      parent = await prisma.parent.update({
        where: { id: parent.id },
        data: {
          otpCode,
          otpExpiresAt: expiresAt,
          email: email || parent.email,
          phone: phone || parent.phone,
        },
      });
    } else {
      // Create new parent (will complete enrollment later)
      // Note: name and email are required in schema
      // If only phone is provided, use a unique placeholder email that will be updated during enrollment
      const placeholderEmail = email || `phone-${phone.replace(/\D/g, '')}@temp.local`;
      parent = await prisma.parent.create({
        data: {
          email: placeholderEmail,
          phone: phone || '',
          name: 'Pending Enrollment', // Will be updated during enrollment
          otpCode,
          otpExpiresAt: expiresAt,
        },
      });
    }

    // TODO: Send OTP via email/SMS
    // For now, we'll log it (remove in production)
    const identifier = email || phone;
    console.log(`OTP for ${identifier}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Remove this in production
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

