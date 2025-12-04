// src/app/api/demo/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawDentistId = searchParams.get("dentistId");

    console.log("[DEMO_LIST] Fetching scans for dentistId:", rawDentistId);

    const dentistId =
      !rawDentistId || rawDentistId === "undefined" ? null : rawDentistId;

    if (!dentistId) {
      return NextResponse.json({ scans: [] });
    }

    const scans = await prisma.demoScan.findMany({
      where: { dentistId },
      include: {
        patient: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("[DEMO_LIST] Found scans:", scans.length);

    const mapped = scans
      .filter((scan) => scan.patient)
      .map((scan) => ({
        id: scan.id,
        patient_name: scan.patient!.name || "Unnamed",
        phone: scan.patient!.phone ?? "",
        email: scan.patient!.email ?? "",
        status: scan.status,
        created_at: scan.createdAt.toISOString(),
        analysisResult: scan.result ?? null,
      }));

    console.log("[DEMO_LIST] Mapped patients:", mapped.length);

    return NextResponse.json({ scans: mapped });
  } catch (err) {
    console.error("[DEMO_LIST] error", err);
    return NextResponse.json(
      { error: "Failed to load demo scans", scans: [] },
      { status: 500 }
    );
  }
}
