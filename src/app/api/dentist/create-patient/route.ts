/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/dentist/create-patient/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { sendDemoSms } from "@/app/lib/dental/demo-sms";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function generateShortCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let out = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    out += chars[idx];
  }
  return out;
}

async function createShortLinkForScan(args: {
  scanId: string;
  dentistId?: string | null;
  patientId?: string | null;
}): Promise<string> {
  const { scanId, dentistId, patientId } = args;

  // retry a few times in case of rare code collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateShortCode(8);
    try {
      await prisma.demoScanLink.create({
        data: {
          code,
          scanId,
          dentistId: dentistId ?? null,
          patientId: patientId ?? null,
        },
      });
      return code;
    } catch (err: any) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" // unique constraint failed
      ) {
        continue; // collision – try again
      }
      throw err;
    }
  }

  throw new Error("Failed to generate unique short code for scan");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, dentistId } = body as {
      name?: string;
      email?: string;
      phone?: string;
      dentistId?: string;
    };

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Patient name and phone are required" },
        { status: 400 }
      );
    }

    // Resolve dentist (demo default if none passed)
    let resolvedDentistId = dentistId ?? null;

    if (!resolvedDentistId) {
      const existing = await prisma.demoDentist.findFirst({
        orderBy: { createdAt: "asc" },
      });

      if (existing) {
        resolvedDentistId = existing.id;
      } else {
        const created = await prisma.demoDentist.create({
          data: {
            name: "Demo Dentist",
            email: null,
            phone: null,
          },
        });
        resolvedDentistId = created.id;
      }
    }

    // 1) Create DemoPatient
    const patient = await prisma.demoPatient.create({
      data: {
        name,
        phone,
        email,
        dentistId: resolvedDentistId,
      },
    });

    // 2) Create DemoScan (link_sent)
    const scan = await prisma.demoScan.create({
      data: {
        status: "link_sent",
        dentistId: resolvedDentistId,
        patientId: patient.id,
      },
    });

    // 3) Direct token URL (internal/debug only)
    const token = jwt.sign(
      {
        scanId: scan.id,
        patientId: patient.id,
        dentistId: resolvedDentistId,
        role: "DEMO_PATIENT",
      },
      DEMO_SECRET,
      { expiresIn: "7d" }
    );
    const fullScanUrl = `${APP_URL}/patient-scan?token=${encodeURIComponent(
      token
    )}`;

    // 4) Short link row
    const shortCode = await createShortLinkForScan({
      scanId: scan.id,
      dentistId: resolvedDentistId,
      patientId: patient.id,
    });
    const shortUrl = `${APP_URL}/ps/${shortCode}`;

    // 5) Fire-and-forget SMS (any error is soft)
    const message = `Hello ${patient.name},
Your secure upload link is ready, Tap to complete the 5 step image submission: ${shortUrl}. Reply STOP to opt out.
DentalScan by ReplyQuick`;

    // we intentionally don't await the result here causing an error on UI;
    // but we still await so logs are correct – the function itself doesn't throw.
    const smsResult = await sendDemoSms(phone!, message);
    if (smsResult.error) {
      console.warn("[CREATE_DEMO_PATIENT] SMS backend error:", smsResult.error);
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Patient link created",
        // keep these for internal debugging if you ever want:
        shortUrl,
        scanUrl: fullScanUrl,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CREATE_DEMO_PATIENT] error", err);
    return NextResponse.json(
      { error: "Failed to create demo patient" },
      { status: 500 }
    );
  }
}