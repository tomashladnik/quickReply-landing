import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";

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

    // Send SMS notification
    const smsMessage = `Hi ${name}! 👋 

Thank you for your interest in DentalScan AI! 

Our team will contact you within 24 hours to schedule your personalized demo.

In the meantime, you can learn more at ${APP_URL}

- DentalScan Team`;

    try {
      await sendDemoSms(phone, smsMessage);
      console.log(`SMS sent successfully to ${phone}`);
    } catch (smsError) {
      console.warn("SMS failed to send:", smsError);
      // Don't fail the request if SMS fails
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact-sales error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
