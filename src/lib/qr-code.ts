import QRCode from 'qrcode';

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate QR Code as Data URL (base64)
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      width: options?.width || 256,
      margin: options?.margin || 1,
      color: options?.color || {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR Code as Buffer (for server-side use)
 */
export async function generateQRCodeBuffer(
  text: string,
  options?: QRCodeOptions
): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      width: options?.width || 256,
      margin: options?.margin || 1,
      color: options?.color || {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw error;
  }
}

/**
 * Generate Multi-Use QR Code URL
 * This creates a unique QR code that routes to different flows based on scan context
 */
export function generateMultiUseQRCode(
  scanId: string,
  flow: 'gym' | 'school' | 'charity',
  baseUrl?: string
): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // return `${base}/api/multiuse/qr-route?scanId=${scanId}&flowType=${flowType}`;
  const url = new URL('/api/multiuse/qr-route', base);
  url.searchParams.set('scanId', scanId);
  url.searchParams.set('flow', flow);
  url.searchParams.set('redirect', '1');

  return url.toString();
}

/**
 * Parse Multi-Use QR Code to extract scan ID and flow type
 */
export function parseMultiUseQRCode(url: string): {
  scanId: string;
  flowType: 'gym' | 'school' | 'charity';
} | null {
  try {
    const urlObj = new URL(url);
    const scanId = urlObj.searchParams.get('scanId');
    const flowType = urlObj.searchParams.get('flowType') as 'gym' | 'school' | 'charity';
    
    if (!scanId || !flowType) {
      return null;
    }
    
    return { scanId, flowType };
  } catch {
    return null;
  }
}

/**
 * Validate QR Code URL format
 */
export function isValidQRCodeURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
