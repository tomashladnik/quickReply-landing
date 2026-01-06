// src/app/api/dentalscan/contact-sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function safeNameFromNotes(notes?: string | null) {
  if (!notes) return "there";
  const match = notes.match(/Name:\s*([^|]+)/i);
  const n = match?.[1]?.trim();
  return n && n.length > 0 ? n : "there";
}

function normalizePhone(phone?: string | null) {
  if (!phone) return "";
  const p = phone.trim();
  if (p.startsWith("+")) return p;
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return p;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phoneRaw = body.phone as string | undefined;
    const email = body.email as string | undefined;
    const pagePath = body.pagePath as string | undefined;
    const notes = body.notes as string | undefined;

    const phone = normalizePhone(phoneRaw);
    const name = safeNameFromNotes(notes);

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

    let dentist = await prisma.demoDentist.findFirst({
      where: { phone },
    });

    if (!dentist) {
      dentist = await prisma.demoDentist.create({
        data: {
          name,
          phone,
          email,
        },
      });
    }

    const demoUrl = `${APP_URL}/dentist-dashboard?demoId=${encodeURIComponent(
      dentist.id
    )}`;

    console.log(
      `Created/found dentist with ID: ${dentist.id} for phone: ${phone}`
    );
    console.log(`Generated demo URL: ${demoUrl}`);

    const smsMessage = `ReplyQuick (DentalScan): Hi ${name}, your demo account is ready.

Tap to access your demo account: ${demoUrl}.

Reply STOP to opt out.`;

    try {
      await sendDemoSms(phone, smsMessage);
      console.log(`SMS sent successfully to ${phone}`);
    } catch (smsError) {
      console.warn("SMS failed to send:", smsError);
    }

    return NextResponse.json({
      ok: true,
      dentistId: dentist.id,
      demoUrl,
    });
  } catch (err) {
    console.error("contact-sales error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
