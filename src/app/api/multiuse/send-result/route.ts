import { NextRequest, NextResponse } from 'next/server';
import { twilioClient, TWILIO_FROM_NUMBER } from '@/app/lib/twilio';
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

    if (!twilioClient || !TWILIO_FROM_NUMBER) {
      console.error('Twilio not configured - SMS service unavailable');
      return NextResponse.json(
        { error: 'SMS service not configured - please set up Twilio credentials' },
        { status: 500 }
      );
    }

    // Create SMS message content - using Message 2 template
    const smsContent = `ReplyQuick (DentalScan): Your scan update is ready. Tap to view your results: ${process.env.STANDARD_PAGE || 'https://replyquick.ai'}/multiusecase/result?token=${userId}. This message is for informational purposes only. Reply STOP to opt out.`;

    // Send SMS
    let messageSid: string | null = null;
    try {
      const message = await twilioClient.messages.create({
        body: smsContent,
        from: TWILIO_FROM_NUMBER,
        to: phone.trim()
      });

      console.log('SMS sent successfully:', message.sid);
      messageSid = message.sid;
    } catch (smsError: any) {
      console.error('SMS sending error:', smsError);
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      );
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
            smsId: messageSid,
            sentAt: new Date().toISOString()
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      messageSid: messageSid,
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