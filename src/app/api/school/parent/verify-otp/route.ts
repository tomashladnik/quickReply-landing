import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const { email, phone, otp } = await req.json();

    if (!otp) {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    // Find parent by email or phone
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

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      );
    }

    if (!parent.otpCode || parent.otpCode !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    if (!parent.otpExpiresAt || parent.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 401 }
      );
    }

    // Clear OTP
    await prisma.parent.update({
      where: { id: parent.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { parentId: parent.id, email: parent.email, role: 'parent' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token,
      parentId: parent.id,
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


