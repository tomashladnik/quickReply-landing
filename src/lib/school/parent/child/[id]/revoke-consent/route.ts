import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

    // Revoke consent and delete all related data (COPPA/HIPAA compliance)
    await prisma.$transaction(async (tx) => {
      // Delete scans
      await tx.schoolScan.deleteMany({
        where: { childId: id },
      });

      // Delete dentist shares
      await tx.dentistShare.deleteMany({
        where: { childId: id },
      });

      // Revoke consent
      await tx.child.update({
        where: { id },
        data: {
          consentGiven: false,
          consentDate: null,
          consentSignature: null,
        },
      });
    });

    // Log for audit
    await prisma.auditLog.create({
      data: {
        userId: decoded.parentId,
        userType: 'parent',
        action: 'revoke_consent',
        resourceType: 'child',
        resourceId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Consent revoked and data deleted',
    });
  } catch (error: any) {
    console.error('Error revoking consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

