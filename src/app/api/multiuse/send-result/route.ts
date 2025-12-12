import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phone, name, result, flowType } = body;

    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Phone number and name are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const replyQuickSmsUrl = process.env.REPLYQUICK_SMS_URL || process.env.REPLYQUICK_RESULTS_SMS_URL || 'https://dashboard.replyquick.ai/api/sms/send';
    if (!replyQuickSmsUrl) {
      console.error('ReplyQuick SMS URL not configured');
      return NextResponse.json(
        { error: 'SMS service not configured - please set REPLYQUICK_SMS_URL or REPLYQUICK_RESULTS_SMS_URL' },
        { status: 500 }
      );
    }

    // Create SMS message content using Message 2 template with short link
    const baseUrl = process.env.STANDARD_PAGE || process.env.NEXT_PUBLIC_BASE_URL || 'https://replyquick.ai';
    
    // Get the short code for this scan
    const scanData = await prisma.$queryRaw<{
      shortCode: string | null;
    }[]>`
      SELECT "shortCode" FROM multiuse_scans_demo WHERE id = ${userId} LIMIT 1
    `;
    
    let resultLink: string;
    if (scanData.length > 0 && scanData[0].shortCode) {
      // Use short link if available
      resultLink = `${baseUrl}/r/${scanData[0].shortCode}`;
    } else {
      // Fallback to full URL if no short code
      resultLink = `${baseUrl}/multiusecase/${flowType}/result?token=${userId}&userId=${userId}`;
    }
    
    const smsContent = [
      `ReplyQuick (DentalScan): Your scan update is ready.`,
      `Tap to view your results: ${resultLink}`,
      `This message is for informational purposes only. Reply STOP to opt out.`
    ].join(' ');

    // Send SMS using the same method as demo SMS
    let messageId: string | null = null;
    try {
      console.log('Sending SMS using demo SMS format to:', phone.trim());
      
      const response = await fetch(replyQuickSmsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // "x-api-key": process.env.RQ_SMS_TOKEN ?? "",
        },
        body: JSON.stringify({
          message: smsContent,
          phoneNumber: phone.trim(),
          // we don't have contactId in this multiuse → leave undefined
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        // if JSON parse fails but HTTP is ok, just ignore
      }

      if (!response.ok) {
        const msg = data?.error || `Remote SMS failed with status ${response.status}`;
        console.warn('[multiuse SMS] Remote backend returned error:', msg);
        // Still DO NOT throw — flow should continue
        messageId = 'error-but-continuing';
      } else {
        console.log('SMS sent successfully via ReplyQuick (demo format):', data);
        messageId = data.messageId || data.id || 'sent';
        
        if (data?.error) {
          console.warn('[multiuse SMS] Remote backend reported soft error with 2xx:', data.error);
        }
      }
    } catch (smsError: any) {
      console.error('SMS sending error:', smsError);
      // Don't fail the whole flow, just log the error
      console.log('SMS failed, but continuing with flow completion...');
      messageId = 'error-but-continuing';
    }

    // Update the scan record with SMS sent status
    if (userId) {
      await prisma.multiuseScan.update({
        where: { id: userId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          resultJson: {
            ...result,
            smsSent: true,
            smsId: messageId,
            sentAt: new Date().toISOString()
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      messageId: messageId,
      message: 'Results sent successfully via SMS'
    });

  } catch (error) {
    console.error('SMS sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}