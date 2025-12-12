//src/app/api/qr-code/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodeDataURL, generateQRCodeBuffer, generateMultiUseQRCode } from '@/lib/qr-code';

/**
 * POST /api/qr-code/generate
 * Generate QR code for dental scan flows
 * 
 * Body:
 * - text?: string (for simple QR code)
 * - scanId?: string (for multi-use QR code)
 * - flowType?: 'gym' | 'school' | 'charity' (for multi-use QR code)
 * - multiUse?: boolean (whether this is a multi-use QR code)
 * - options?: QRCodeOptions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, scanId, flowType, multiUse, options } = body;

    // Generate multi-use QR code
    if (multiUse && scanId && flowType) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const qrUrl = generateMultiUseQRCode(scanId, flowType, baseUrl);
      
      const dataURL = await generateQRCodeDataURL(qrUrl, options);

      return NextResponse.json({
        success: true,
        url: qrUrl,
        dataURL,
        scanId,
        flowType,
        type: 'multiuse',
      });
    }

    // Generate simple QR code
    if (text) {
      const dataURL = await generateQRCodeDataURL(text, options);

      return NextResponse.json({
        success: true,
        url: text,
        dataURL,
        type: 'simple',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Missing required parameters',
        message: 'Provide either "text" for simple QR or "scanId" and "flowType" for multi-use QR',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate QR code',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/qr-code/generate?text=...
 * Generate QR code from query parameters (for testing)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('text');
    const scanId = searchParams.get('scanId');
    const flowType = searchParams.get('flowType') as 'gym' | 'school' | 'charity' | null;

    if (!text && !scanId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters',
          message: 'Provide either "text" or "scanId" query parameter',
        },
        { status: 400 }
      );
    }

    let qrUrl = text || '';

    // Generate multi-use QR if scanId provided
    if (scanId && flowType) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      qrUrl = generateMultiUseQRCode(scanId, flowType, baseUrl);
    }

    const buffer = await generateQRCodeBuffer(qrUrl);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate QR code',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}