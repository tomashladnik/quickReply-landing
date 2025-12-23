import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('studentToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as { schoolId: string; studentId: string };
    const { studentId } = decoded;

    // Get the latest completed scan
    const latestScan = await prisma.studentScan.findFirst({
      where: {
        studentId,
        status: 'completed',
        resultCategory: { not: null },
      },
      orderBy: { timestamp: 'desc' },
    });

    if (!latestScan) {
      return NextResponse.json({
        message: 'No completed scans found',
        category: null,
      });
    }

    return NextResponse.json({
      category: latestScan.resultCategory,
      message: 'Ask your parents for details.',
    });
  } catch (error: unknown) {
    console.error('Result fetch error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
