import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('code');

    console.log('User-info API called with userId/code:', userId);

    if (!userId) {
      console.log('User-info API: No userId or code provided');
      return NextResponse.json(
        { error: 'User ID or code is required' },
        { status: 400 }
      );
    }

    // Fetch user data from the database
    console.log('User-info API: Searching for user with ID:', userId);
    const scan = await prisma.multiuseScan.findUnique({
      where: { id: userId },
      select: {
        id: true,
        patientName: true,
        patientPhone: true,
        flowType: true,
        status: true,
        originalJson: true,
        resultJson: true
      }
    });

    console.log('User-info API: Database query result:', scan);

    if (!scan) {
      console.log('User-info API: No user found with ID:', userId);
      
      // Let's also try to find all records to see what's in the database
      const allScans = await prisma.multiuseScan.findMany({
        select: { id: true, patientName: true, flowType: true },
        take: 5
      });
      console.log('User-info API: Recent records in database:', allScans);
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: scan.id,
        name: scan.patientName,
        phone: scan.patientPhone,
        flowType: scan.flowType,
        status: scan.status,
        originalJson: scan.originalJson,  // Use consistent field names
        resultJson: scan.resultJson      // Use consistent field names
      },
      // Also include direct access to the data
      patientName: scan.patientName,
      patientPhone: scan.patientPhone,
      flowType: scan.flowType,
      status: scan.status,
      originalJson: scan.originalJson,
      resultJson: scan.resultJson
    });

  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}