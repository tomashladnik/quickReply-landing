// src/app/api/sales/send-demo/route.ts
export const runtime = "nodejs";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type IncomingBody = {
  dentistName?: string;
  dentistPhone?: string;
  dentistEmail?: string;
  name?: string;
  phone?: string;
  email?: string;
};

function makeCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingBody;

    const name = (body.dentistName ?? body.name ?? "").toString().trim();
    const phone = (body.dentistPhone ?? body.phone ?? "").toString().trim();
    const emailRaw = (body.dentistEmail ?? body.email ?? "") as string | undefined;
    const email = emailRaw?.toString().trim() || null;

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
    }

    let patient = await prisma.demoPatient.findFirst({
      where: { phone },
    });

    if (!patient) {
      patient = await prisma.demoPatient.create({
        data: {
          name,
          phone,
          email,
          dentist: {
            connect: { id: (await prisma.demoDentist.findFirst())?.id || (await prisma.demoDentist.create({ data: { name: "Demo Dentist", phone: "0000000000" } })).id },
          },
        },
      });
    } else {
      if (email && (!patient.email || patient.email !== email)) {
        patient = await prisma.demoPatient.update({
          where: { id: patient.id },
          data: { email },
        });
      }
      if (name && patient.name !== name) {
        patient = await prisma.demoPatient.update({
          where: { id: patient.id },
          data: { name },
        });
      }
    }

    const scan = await prisma.demoScan.create({
      data: {
        status: "link_sent",
        patient: { connect: { id: patient.id } },
      },
    });

    let code = makeCode(8);
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.demoScanLink.findUnique({ where: { code } });
      if (!exists) break;
      code = makeCode(8);
    }

    await prisma.demoScanLink.create({
      data: {
        code,
        scan: { connect: { id: scan.id } },
        patientId: patient.id,
      },
    });

    const scanUrl = `${APP_URL}/ps/${code}`;

    const smsBody = `Hello ${name},
Here is your secure DentalScan demo link: ${scanUrl}

DentalScan by ReplyQuick AI`;

    let smsError: string | null = null;
    try {
      await sendDemoSms(phone, smsBody);
    } catch (err: any) {
      console.warn("[SALES/SEND_DEMO] SMS send failed:", err?.message || err);
      smsError = err?.message || "Unknown SMS error";
    }

    return NextResponse.json({
      ok: true,
      code,
      scanId: scan.id,
      scanUrl,
      smsError,
    });
  } catch (error) {
    console.error("[SALES/SEND_DEMO] fatal error", error);
    return NextResponse.json({ ok: false, error: "Failed to send demo SMS" }, { status: 500 });
  }
}