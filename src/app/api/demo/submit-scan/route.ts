import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, dob, programCode } = await req.json();

    // Decode JWT to find the record
    const decoded = jwt.decode(token) as { scanId: string };
    const scanId = decoded?.scanId;

    if (!scanId) return NextResponse.json({ error: "Invalid session" }, { status: 400 });

    // Update record to completed and lock the date
    const updated = await prisma.demoScan.update({
      where: { id: scanId },
      data: {
        status: "completed",
        dob: new Date(dob),
        programCode: programCode,
        completedAt: new Date(), // This starts the clock
      },
    });

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: "Failed to save scan" }, { status: 500 });
  }
}