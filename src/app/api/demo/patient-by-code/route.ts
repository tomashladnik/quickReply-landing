// src/app/api/demo/patient-by-code/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") ?? "").toString().trim();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const link = await prisma.demoScanLink.findUnique({
      where: { code },
      include: {
        scan: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!link || !link.scan || !link.scan.patient) {
      return NextResponse.json(
        { error: "Invalid link" },
        { status: 404 }
      );
    }

    const patient: any = link.scan.patient as any;

    return NextResponse.json({
      scanId: link.scan.id,
      patient_name: patient.name,
      phone: patient.phone,
      email: patient.email ?? "",
      status: link.scan.status ?? "link_sent",
      dob: patient.dob ?? null,
    });
  } catch (error) {
    console.error("[DEMO_PATIENT_BY_CODE] error", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}