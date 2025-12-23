import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, organization, type, message } = data;
    if (!name || !email || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const record = await prisma.partnerWithUs.create({
      data: { name, email, organization, type, message },
    });
    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
