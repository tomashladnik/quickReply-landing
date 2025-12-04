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
  // ⬅️ params is a Promise in Next 16 route handlers
  const { code } = await context.params;

  // Look up the short-link
  const link = await prisma.demoScanLink.findUnique({
    where: { code },
    include: { scan: true },
  });

  // If no link or no scan → invalid
  if (!link || !link.scan) {
    return NextResponse.redirect(new URL("/invalid-link", req.url));
  }

  // Optional: expiry
  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/invalid-link", req.url));
  }

  // Build JWT token for /patient-scan
  const token = jwt.sign(
    {
      scanId: link.scanId,
      patientId: link.scan.patientId ?? undefined,
      dentistId: link.scan.dentistId ?? undefined,
      role: "DEMO_PATIENT",
    },
    DEMO_SECRET,
    { expiresIn: "7d" }
  );

  const target = new URL(
    `/patient-scan?token=${encodeURIComponent(token)}`,
    req.url
  );

  // 307 redirect to the real patient scan page
  return NextResponse.redirect(target);
}
