import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('studentToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtSigningKey = process.env.JWT_SIGNING_KEY;
    if (!jwtSigningKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSigningKey) as { schoolId: string; studentId: string };
    const { schoolId, studentId } = decoded;

    // Generate a scan token for the student
    const scanToken = jwt.sign(
      { studentId, schoolId, type: 'student-scan' },
      jwtSigningKey,
      { expiresIn: '24h' } // Match login token expiry
    );

    return NextResponse.json({ token: scanToken });
  } catch (error: unknown) {
    console.error('Token generation error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
