// src/app/api/partner-with-us/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_PROGRAMS = ["charity", "gym", "employer", "school"] as const;
type Program = (typeof ALLOWED_PROGRAMS)[number];

function isProgram(v: unknown): v is Program {
  return (
    typeof v === "string" &&
    (ALLOWED_PROGRAMS as readonly string[]).includes(v)
  );
}

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const program = data?.program;
    if (!program || !isProgram(program)) {
      return NextResponse.json({ error: "Invalid program." }, { status: 400 });
    }

    // Pull common fields from your NEW UI (camelCase)
    const email = s(data.email || data.workEmail);
    const phone = s(data.phone);
    const organization =
      program === "charity"
        ? s(data.organizationName)
        : program === "gym"
          ? s(data.gymName)
          : s(data.companyName);

    const name =
      program === "charity"
        ? s(data.contactPersonName)
        : program === "employer"
          ? s(data.contactName)
          : ""; // gym form doesn't have separate contact name

    // Basic validation (you can tighten per program later)
    if (!email || !phone || !organization) {
      return NextResponse.json(
        { error: "Missing required fields.", missing: ["email/phone/organization"] },
        { status: 400 }
      );
    }

    const record = await prisma.partnerApplication.create({
      data: {
        program,
        status: "new",

        name: name || null,
        email: email.toLowerCase(),
        phone,

        organization: organization || null,
        street_address: s(data.address) || null,
        city: s(data.city) || null,
        state: s(data.state) || null,
        zip_code: s(data.zip) || null,
        country: "USA",

        notes: s(data.additionalNotes || data.message) || "",
        decision_path: "partner_with_us",

        payload: data, // ✅ store full form exactly as submitted
      },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch {
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
