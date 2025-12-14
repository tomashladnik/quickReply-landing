import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone = body.phone as string | undefined;
    const email = body.email as string | undefined;
    const pagePath = body.pagePath as string | undefined;
    const notes = body.notes as string | undefined;
    const name = notes?.split('Name: ')[1]?.split(' |')[0] || "there";

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Phone is required" },
        { status: 400 }
      );
    }

    await createDentalLead({
      source: "contact_sales",
      phone,
      email,
      pagePath,
      notes,
    });

    if (email) {
        await subscribeDentalLeadToConvertKit(email, "contact_sales");
    }

    // Create or find demo dentist for dashboard link
    let dentist = await prisma.demoDentist.findFirst({
      where: { phone: phone },
    });

    if (!dentist) {
      dentist = await prisma.demoDentist.create({
        data: {
          name: name,
          phone: phone,
          email: email,
        },
      });
    }

    const demoUrl = `${APP_URL}/dentist-dashboard?demoId=${encodeURIComponent(dentist.id)}`;

    console.log(`Created/found dentist with ID: ${dentist.id} for phone: ${phone}`);
    console.log(`Generated demo URL: ${demoUrl}`);

    // Send SMS notification
    const smsMessage = `ReplyQuick (DentalScan): Hi ${name}, your secure upload link is ready. 

Tap to complete your 5-step image submission: ${demoUrl}. 

Reply STOP to opt out.`;

    try {
      await sendDemoSms(phone, smsMessage);
      console.log(`SMS sent successfully to ${phone}`);
    } catch (smsError) {
      console.warn("SMS failed to send:", smsError);
      // Don't fail the request if SMS fails
    }

    return NextResponse.json({ 
      ok: true, 
      dentistId: dentist.id,
      demoUrl: demoUrl
    });
  } catch (err) {
    console.error("contact-sales error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
