import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dentistId = searchParams.get("dentistId") || undefined;

    const scans = await prisma.demoScan.findMany({
      where: dentistId ? { dentistId } : {},
      include: {
        patient: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = scans.map((scan) => ({
      id: scan.id,
      patient_name: scan.patient?.name ?? "Unknown",
      phone: scan.patient?.phone ?? "",
      email: scan.patient?.email ?? "",
      status: scan.status,
      created_at: scan.createdAt.toISOString(),
      analysisResult: scan.result ?? null,
    }));

    return NextResponse.json({ scans: mapped });
  } catch (err) {
    console.error("[DEMO_LIST] error", err);
    return NextResponse.json(
      { error: "Failed to load demo scans" },
      { status: 500 }
    );
  }
}
