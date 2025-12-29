import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'School code is required' },
        { status: 400 }
      );
    }

    const schoolCode = await prisma.schoolCode.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        school: true,
      },
    });

    if (!schoolCode || !schoolCode.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive school code' },
        { status: 404 }
      );
    }

    if (schoolCode.expiresAt && schoolCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'School code has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      schoolId: schoolCode.schoolId,
      schoolName: schoolCode.school.name,
      district: schoolCode.school.district,
    });
  } catch (error: any) {
    console.error('Error verifying school code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


