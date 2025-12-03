import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

    // Resolve dentist:
    // - if dentistId passed (later from dashboard token), use that
    // - otherwise use first DemoDentist or create a default one
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

    // 3) Sign patient scan token
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

    // 4) Patient scan URL
    const scanUrl = `${APP_URL}/patient-scan?token=${encodeURIComponent(
      token
    )}`;

    return NextResponse.json({ scanUrl });
  } catch (err) {
    console.error("[CREATE_DEMO_PATIENT] error", err);
    return NextResponse.json(
      { error: "Failed to create demo patient" },
      { status: 500 }
    );
  }
}
