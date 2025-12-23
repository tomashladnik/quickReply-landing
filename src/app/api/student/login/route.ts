import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
      include: { school: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password (stored as plain text for demo - in production, use bcrypt)
    if (student.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check JWT_SIGNING_KEY is set
    const jwtSigningKey = process.env.JWT_SIGNING_KEY;
    if (!jwtSigningKey) {
      console.error('JWT_SIGNING_KEY is not set in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate JWT token with schoolId and studentId
    const token = jwt.sign(
      { schoolId: student.schoolId, studentId: student.id },
      jwtSigningKey,
      { expiresIn: '24h' }
    );

    // Set HTTP-only secure cookie
    const response = NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        school: student.school.name,
      },
    });

    response.cookies.set('studentToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
