/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/sales/send-demo/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type IncomingBody = {
  dentistName?: string;
  dentistPhone?: string;
  dentistEmail?: string;
  name?: string;
  phone?: string;
  email?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingBody;

    const dentistName = (body.dentistName ?? body.name ?? "").toString().trim();
    const dentistPhone = (body.dentistPhone ?? body.phone ?? "")
      .toString()
      .trim();
    const dentistEmailRaw = (body.dentistEmail ?? body.email ?? "") as
      | string
      | undefined;
    const dentistEmail = dentistEmailRaw?.toString().trim() || null;

    if (!dentistName || !dentistPhone) {
      return NextResponse.json(
        { ok: false, error: "Dentist name and phone are required" },
        { status: 400 }
      );
    }

    // One demo dentist per phone; sending again re-uses the same demo account
    let dentist = await prisma.demoDentist.findFirst({
      where: { phone: dentistPhone },
    });

    if (!dentist) {
      dentist = await prisma.demoDentist.create({
        data: {
          name: dentistName,
          phone: dentistPhone,
          email: dentistEmail,
        },
      });
    }

    const demoUrl = `${APP_URL}/dentist-dashboard?demoId=${dentist.id}`;

    const smsBody = `Hello ${dentistName},
This is your demo dashboard for DentalScan. Here is your secure link: ${demoUrl}.

This demo account will be valid only for 30 days.

DentalScan by ReplyQuick AI`;

    // --- IMPORTANT CHANGE: treat SMS failure as soft error ---
    let smsError: string | null = null;
    try {
      await sendDemoSms(dentistPhone, smsBody);
    } catch (err: any) {
      console.warn(
        "[SALES/SEND_DEMO] SMS send failed but continuing with demo link:",
        err?.message || err
      );
      smsError = err?.message || "Unknown SMS error";
    }

    // Always return ok: true as long as the demo account + link are created
    return NextResponse.json({
      ok: true,
      dentistId: dentist.id,
      demoUrl,
      smsError,
    });
  } catch (error) {
    console.error("[SALES/SEND_DEMO] fatal error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send demo SMS" },
      { status: 500 }
    );
  }
}
