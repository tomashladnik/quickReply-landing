// src/app/api/demo/save-dob/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; dob?: string };

    const code = (body.code ?? "").toString().trim();
    const dob = (body.dob ?? "").toString().trim();

    if (!code || !dob) {
      return NextResponse.json(
        { error: "Code and dob are required" },
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

    /*await prisma.demoPatient.update({
      where: { id: patient.id },
      data: {
        dob: new Date(dob),
      } as any,
    });*/
    await prisma.$executeRawUnsafe(`UPDATE demo_patient SET dob = '$1:date WHERE id = $2'`, dob, patient.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DEMO_SAVE_DOB] error", error);
    return NextResponse.json(
      { error: "Failed to save date of birth" },
      { status: 500 }
    );
  }
}