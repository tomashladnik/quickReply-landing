import { NextResponse } from "next/server";
import { mockSchools, newChildRecord } from "../mock-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const {
    schoolCode,
    parentName,
    parentEmail,
    parentPhone,
    childName,
    classroom,
    digitalSignature,
    shareWithDentist,
    dentistEmail,
  } = body || {};

  if (
    !schoolCode ||
    !parentName ||
    !parentEmail ||
    !parentPhone ||
    !childName ||
    !classroom ||
    !digitalSignature
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const school = mockSchools.find(
    (s) => s.code === schoolCode.toString().trim().toUpperCase()
  );

  if (!school) {
    return NextResponse.json(
      { error: "School code not found" },
      { status: 404 }
    );
  }

  const child = newChildRecord({
    name: childName,
    classroom,
    school: school.name,
    parentEmail,
  });

  const consent = {
    status: "active",
    signedBy: parentName,
    signedAt: new Date().toISOString(),
    digitalSignature,
    shareWithDentist: !!shareWithDentist,
    dentistEmail: dentistEmail || null,
  };

  return NextResponse.json({
    success: true,
    school,
    child,
    consent,
    message: `${childName} has been enrolled and consent is active.`,
  });
}


