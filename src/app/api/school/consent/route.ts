import { NextResponse } from "next/server";

const mockConsent = {
  active: true,
  lastUpdated: "2024-01-01",
  children: ["Emma Doe", "Lucas Doe"],
};

export async function GET() {
  return NextResponse.json({ consent: mockConsent });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const { active } = body || {};
  if (typeof active !== "boolean") {
    return NextResponse.json(
      { error: "active boolean is required" },
      { status: 400 }
    );
  }
  mockConsent.active = active;
  mockConsent.lastUpdated = new Date().toISOString();

  return NextResponse.json({
    success: true,
    consent: mockConsent,
  });
}

export async function DELETE() {
  // Simulate deletion request
  return NextResponse.json({
    success: true,
    message: "Data deletion request submitted",
  });
}


