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

    // Find or create parent
    let parent = await prisma.parent.findUnique({
      where: { email },
    });

    if (parent) {
      // Update OTP
      parent = await prisma.parent.update({
        where: { id: parent.id },
        data: {
          otpCode,
          otpExpiresAt: expiresAt,
          phone: phone || parent.phone,
        },
      });
    } else {
      // Create new parent (will complete enrollment later)
      // Note: name is required in schema, so we use a placeholder
      parent = await prisma.parent.create({
        data: {
          email,
          phone: phone || '',
          name: 'Pending Enrollment', // Will be updated during enrollment
          otpCode,
          otpExpiresAt: expiresAt,
        },
      });
    }

    // TODO: Send OTP via email/SMS
    // For now, we'll log it (remove in production)
    console.log(`OTP for ${email}: ${otpCode}`);

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

