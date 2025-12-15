import { NextResponse } from "next/server";
import { mockSchools } from "../mock-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = body?.code?.toString().trim().toUpperCase();

  if (!code) {
    return NextResponse.json(
      { error: "School code is required" },
      { status: 400 }
    );
  }

  const school = mockSchools.find((s) => s.code === code);
  if (!school) {
    return NextResponse.json(
      { valid: false, message: "School code not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    valid: true,
    school,
  });
}


