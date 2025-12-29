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

export async function GET(
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
      include: {
        school: true,
        dentistShares: {
          include: {
            dentist: true,
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    const shares = child.dentistShares.map((share) => ({
      id: share.id,
      dentistName: share.dentist.name || '',
      dentistEmail: share.dentist.email,
      isActive: share.isActive,
      createdAt: share.createdAt,
    }));

    return NextResponse.json({
      child: {
        id: child.id,
        name: child.name,
      },
      shares,
    });
  } catch (error: any) {
    console.error('Error fetching dentist shares:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


