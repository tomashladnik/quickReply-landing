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
    const { shareId } = await req.json();

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
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

    const share = await prisma.dentistShare.findFirst({
      where: {
        id: shareId,
        childId: child.id,
        parentId: decoded.parentId,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      );
    }

    // Revoke access
    await prisma.dentistShare.update({
      where: { id: shareId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    // Log for audit
    await prisma.auditLog.create({
      data: {
        userId: decoded.parentId,
        userType: 'parent',
        action: 'revoke_dentist_access',
        resourceType: 'child',
        resourceId: child.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Error revoking dentist access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

