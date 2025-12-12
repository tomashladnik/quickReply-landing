import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /r/{code}
 * Short link redirect service
 * Looks up the short code and redirects to the full result URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    if (!code) {
      return new NextResponse('Invalid short link', { status: 400 });
    }

    // Look up the short code in the database using raw query
    const scan = await prisma.$queryRaw<{
      id: string;
      flow_type: string;
      status: string;
      completed_at: Date | null;
    }[]>`
      SELECT id, flow_type, status, completed_at
      FROM multiuse_scans_demo
      WHERE "shortCode" = ${code}
      LIMIT 1
    `;

    if (!scan || scan.length === 0) {
      return new NextResponse('Short link not found or expired', { status: 404 });
    }

    const result = scan[0];

    // Build the full result URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resultUrl = new URL(`/multiusecase/${result.flow_type}/result`, baseUrl);
    resultUrl.searchParams.set('token', result.id);
    resultUrl.searchParams.set('userId', result.id);

    // Redirect to the full result page
    return NextResponse.redirect(resultUrl.toString());

  } catch (error) {
    console.error('Short link redirect error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}