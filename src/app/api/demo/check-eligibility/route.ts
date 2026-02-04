import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, dob, program_code } = await req.json();

    // 1. Decode JWT to get actual database scanId
    const decoded = jwt.decode(token) as { scanId: string };
    const scanId = decoded?.scanId;

    if (!scanId) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    const program = await prisma.program.findUnique({ where: { code: program_code } });
    if (!program) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    // 2. Eligibility Check: Look for previous "completed" scans
    const lastScan = await prisma.demoScan.findFirst({
      where: { dob: new Date(dob), programCode: program_code, status: "completed" },
      orderBy: { completedAt: "desc" },
    });

    if (lastScan?.completedAt) {
      const nextDate = new Date(lastScan.completedAt);
      nextDate.setDate(nextDate.getDate() + program.intervalDays);
      if (new Date() < nextDate) {
        return NextResponse.json({ 
          allowed: false, 
          nextDate: nextDate.toLocaleDateString() 
        });
      }
    }

    // 3. Update the existing row with DOB and Program
    await prisma.demoScan.update({
      where: { id: scanId },
      data: { dob: new Date(dob), programCode: program_code },
    });

    return NextResponse.json({ allowed: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}