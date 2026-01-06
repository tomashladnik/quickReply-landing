/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/dentalscan/contact-sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone = body.phone as string | undefined;
    const email = body.email as string | undefined;
    const pagePath = body.pagePath as string | undefined;
    const notes = body.notes as string | undefined;

    const name =
      notes?.split("Name: ")[1]?.split(" |")[0]?.trim() || "there";

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
      try {
        await subscribeDentalLeadToConvertKit(email, "contact_sales");
      } catch (e) {
        console.warn("[contact-sales] ConvertKit subscribe failed:", e);
      }
    }

    // Create or find demo dentist
    let dentist = await prisma.demoDentist.findFirst({
      where: { phone },
    });

    if (!dentist) {
      dentist = await prisma.demoDentist.create({
        data: {
          name,
          phone,
          email: email || null,
        },
      });
    }

    const demoUrl = `${APP_URL}/dentist-dashboard?demoId=${encodeURIComponent(
      dentist.id
    )}`;

    console.log(
      `[contact-sales] Dentist ${dentist.id} for phone ${phone} demoUrl=${demoUrl}`
    );

    const smsMessage = `ReplyQuick (DentalScan): Hi ${name}, your secure upload link is ready.

Tap to complete your 5-step image submission: ${demoUrl}.

Reply STOP to opt out.`;

    // ✅ IMPORTANT: sendDemoSms returns success/failure — it does NOT throw in most cases
    let smsSent = false;
    let smsError: string | null = null;

    try {
      const smsRes: any = await sendDemoSms(phone, smsMessage);

      smsSent = smsRes?.success === true || smsRes?.ok === true;

      if (!smsSent) {
        smsError =
          smsRes?.error ||
          smsRes?.message ||
          "SMS failed (unknown error)";
        console.warn("[contact-sales] SMS not sent:", smsRes);
      } else {
        console.log(`[contact-sales] SMS sent successfully to ${phone}`);
      }
    } catch (e: any) {
      smsSent = false;
      smsError = e?.message || "SMS failed (exception)";
      console.warn("[contact-sales] SMS send threw error:", e);
    }

    // ✅ Always return demoUrl so frontend can show copy fallback if smsSent=false
    return NextResponse.json({
      ok: true,
      dentistId: dentist.id,
      demoUrl,
      smsSent,
      smsError,
    });
  } catch (err) {
    console.error("contact-sales error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
