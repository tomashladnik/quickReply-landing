import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body as { token?: string };

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, DEMO_SECRET) as {
        scanId: string;
        patientId: string;
      };
    } catch (err) {
      console.error("[DEMO_SCAN] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const scan = await prisma.demoScan.findUnique({
      where: { id: payload.scanId },
      include: { patient: true },
    });

    if (!scan || !scan.patient) {
      return NextResponse.json(
        { error: "Scan or patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      scanId: scan.id,
      patient_name: scan.patient.name,
      phone: scan.patient.phone,
      email: scan.patient.email,
      status: scan.status,
      result: scan.result,
    });
  } catch (err) {
    console.error("[DEMO_SCAN] error", err);
    return NextResponse.json(
      { error: "Failed to load patient" },
      { status: 500 }
    );
  }
}
