// src/app/api/sales/send-demo/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dentistName,
      dentistPhone,
      dentistEmail,
    } = body as {
      dentistName?: string;
      dentistPhone?: string;
      dentistEmail?: string;
    };

    if (!dentistName || !dentistPhone) {
      return NextResponse.json(
        { ok: false, error: "Dentist name and phone are required" },
        { status: 400 }
      );
    }

    // 1) create / find demo dentist
    let dentist = await prisma.demoDentist.findFirst({
      where: { phone: dentistPhone },
    });

    if (!dentist) {
      dentist = await prisma.demoDentist.create({
        data: {
          name: dentistName,
          phone: dentistPhone,
          email: dentistEmail ?? null,
        },
      });
    }

    // 2) generate dentist demo link (dashboard-style)
    const demoUrl = `${APP_URL}/dentist-dashboard?demoId=${dentist.id}`;

    // 3) compose SMS using Rahul's Message 1 template
    const smsBody = `ReplyQuick (DentalScan): Hi ${dentistName}, your secure upload link is ready. Tap to complete your 5-step image submission: ${demoUrl}. Reply STOP to opt out.`;

    // 4) send SMS via main backend
    await sendDemoSms(dentistPhone, smsBody);

    return NextResponse.json({
      ok: true,
      dentistId: dentist.id,
      demoUrl,
    });
  } catch (error) {
    console.error("[SALES/SEND_DEMO] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send demo SMS" },
      { status: 500 }
    );
  }
}