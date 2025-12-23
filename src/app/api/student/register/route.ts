import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, schoolId, parentId, parentName, parentPhone, parentEmail } =
      await request.json();

    if (!email || !password || !name || !schoolId || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, schoolId, parentName, parentPhone' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Check if school exists; if not, create a simple record so first-time
    // flows work without a separate school admin UI.
    let school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      school = await prisma.school.create({
        data: {
          id: schoolId,
          name: `School ${schoolId}`,
        },
      });
    }

    // Use transaction to ensure parent and student are created atomically
    const { student } = await prisma.$transaction(async (tx) => {
      // Find or create parent
      let parent;
      const existingParent = await tx.parent.findFirst({
        where: { phone: parentPhone },
      });

      if (existingParent) {
        parent = existingParent;
      } else {
        parent = await tx.parent.create({
          data: {
            name: parentName,
            phone: parentPhone,
            email: parentEmail || null,
          },
        });
      }

      // Create student account
      const student = await tx.student.create({
        data: {
          email,
          password, // In production, hash this with bcrypt
          name,
          schoolId,
          parentId: parent.id,
        },
        include: {
          school: true,
        },
      });

      return { parent, student };
    });

    // Check JWT_SIGNING_KEY is set
    const jwtSigningKey = process.env.JWT_SIGNING_KEY;
    if (!jwtSigningKey) {
      console.error('JWT_SIGNING_KEY is not set in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { schoolId: student.schoolId, studentId: student.id },
      jwtSigningKey,
      { expiresIn: '24h' }
    );

    // Set HTTP-only secure cookie
    const response = NextResponse.json(
      {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          school: student.school.name,
        },
      },
      { status: 201 }
    );

    response.cookies.set('studentToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

