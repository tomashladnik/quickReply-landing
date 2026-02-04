// src/app/ps/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const link = await prisma.demoScanLink.findUnique({
    where: { code },
    include: {
      scan: {
        include: { patient: true },
      },
    },
  });

  if (!link || !link.scan || !link.scan.patient) {
    return NextResponse.redirect(new URL("/invalid-link", req.url));
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/invalid-link", req.url));
  }

  const token = jwt.sign(
    {
      scanId: link.scanId,
      patientId: link.scan.patientId ?? undefined,
      role: "DEMO_PATIENT",
      code,
    },
    DEMO_SECRET,
    { expiresIn: "7d" }
  );

  const target = new URL(`/patient-scan?token=${encodeURIComponent(token)}`, req.url);
  return NextResponse.redirect(target);
}