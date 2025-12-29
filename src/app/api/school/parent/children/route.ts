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

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || decoded.role !== 'parent') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const children = await prisma.child.findMany({
      where: { parentId: decoded.parentId },
      include: {
        school: true,
        class: true,
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const childrenData = children.map((child) => ({
      id: child.id,
      name: child.name,
      school: child.school.name,
      className: child.class?.name || child.grade || '',
      grade: child.grade || '',
      latestScanDate: child.scans[0]?.createdAt || null,
      latestCategory: child.scans[0]?.category || null,
    }));

    return NextResponse.json({
      children: childrenData,
    });
  } catch (error: any) {
    console.error('Error fetching children:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


