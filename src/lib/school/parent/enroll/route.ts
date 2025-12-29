import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const {
      schoolCode,
      parentName,
      childName,
      grade,
      classroom,
      parentEmail,
      parentPhone,
      consentSignature,
      shareWithDentist,
      dentistEmail,
    } = await req.json();

    // Validate required fields
    if (!schoolCode || !parentName || !childName || !parentEmail || !parentPhone || !consentSignature) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Verify school code
    const schoolCodeRecord = await prisma.schoolCode.findUnique({
      where: { code: schoolCode.toUpperCase() },
      include: { school: true },
    });

    if (!schoolCodeRecord || !schoolCodeRecord.isActive) {
      return NextResponse.json(
        { error: 'Invalid school code' },
        { status: 400 }
      );
    }

    // Find or create parent
    let parent = await prisma.parent.findUnique({
      where: { email: parentEmail },
    });

    if (parent) {
      // Update parent info
      parent = await prisma.parent.update({
        where: { id: parent.id },
        data: {
          name: parentName,
          phone: parentPhone,
        },
      });
    } else {
      // Create new parent
      parent = await prisma.parent.create({
        data: {
          name: parentName,
          email: parentEmail,
          phone: parentPhone,
        },
      });
    }

    // Find or create class
    let classRecord = null;
    if (classroom || grade) {
      const className = classroom ? `${grade ? `Grade ${grade} - ` : ''}${classroom}` : `Grade ${grade}`;
      
      classRecord = await prisma.schoolClass.findFirst({
        where: {
          schoolId: schoolCodeRecord.schoolId,
          name: className,
        },
      });

      if (!classRecord) {
        classRecord = await prisma.schoolClass.create({
          data: {
            name: className,
            grade: grade || null,
            room: classroom || null,
            schoolId: schoolCodeRecord.schoolId,
          },
        });
      }
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        name: childName,
        parentId: parent.id,
        schoolId: schoolCodeRecord.schoolId,
        classId: classRecord?.id || null,
        grade: grade || null,
        consentGiven: true,
        consentDate: new Date(),
        consentSignature,
      },
    });

    // Handle dentist sharing if requested
    if (shareWithDentist && dentistEmail) {
      // Find or create dentist
      let dentist = await prisma.schoolDentist.findUnique({
        where: { email: dentistEmail },
      });

      if (!dentist) {
        dentist = await prisma.schoolDentist.create({
          data: {
            name: '', // Will be filled when dentist accepts invite
            email: dentistEmail,
          },
        });
      }

      // Create share with invite token
      const inviteToken = crypto.randomBytes(32).toString('hex');
      await prisma.dentistShare.create({
        data: {
          childId: child.id,
          parentId: parent.id,
          dentistId: dentist.id,
          inviteToken,
          isActive: true,
          activatedAt: new Date(),
        },
      });

      // TODO: Send invite email to dentist
    }

    // Generate JWT token
    const token = jwt.sign(
      { parentId: parent.id, email: parent.email, role: 'parent' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Log enrollment for audit
    await prisma.auditLog.create({
      data: {
        userId: parent.id,
        userType: 'parent',
        action: 'enroll_child',
        resourceType: 'child',
        resourceId: child.id,
      },
    });

    return NextResponse.json({
      success: true,
      token,
      parentId: parent.id,
      childId: child.id,
    });
  } catch (error: any) {
    console.error('Error enrolling child:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

