import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== 'parent') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { dentistEmail } = await req.json();

    if (!dentistEmail) {
      return NextResponse.json(
        { error: 'Dentist email is required' },
        { status: 400 }
      );
    }

    const child = await prisma.child.findFirst({
      where: {
        id,
        parentId: decoded.parentId,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

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

    // Check if share already exists
    const existingShare = await prisma.dentistShare.findFirst({
      where: {
        childId: child.id,
        dentistId: dentist.id,
        isActive: true,
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: 'Dentist already has access' },
        { status: 400 }
      );
    }

    // Create share with invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const share = await prisma.dentistShare.create({
      data: {
        childId: child.id,
        parentId: decoded.parentId,
        dentistId: dentist.id,
        inviteToken,
        isActive: true,
        activatedAt: new Date(),
      },
    });

    // TODO: Send invite email to dentist with link
    // Link format: /school/dentist/invite?token=${inviteToken}
    const inviteLink = `${APP_URL}/school/dentist/invite?token=${inviteToken}`;
    console.log(`Dentist invite link: ${inviteLink}`);

    // Log for audit
    await prisma.auditLog.create({
      data: {
        userId: decoded.parentId,
        userType: 'parent',
        action: 'share_with_dentist',
        resourceType: 'child',
        resourceId: child.id,
      },
    });

    return NextResponse.json({
      success: true,
      shareId: share.id,
    });
  } catch (error: any) {
    console.error('Error sharing with dentist:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


