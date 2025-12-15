import { NextResponse } from "next/server";
import {
  mockDentistSharing,
  upsertDentistInvite,
  updateDentistShareStatus,
} from "../mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("childId");
  if (!childId) {
    return NextResponse.json(
      { error: "childId is required" },
      { status: 400 }
    );
  }
  const status = mockDentistSharing[childId] ?? {
    status: "not_shared",
    dentistEmail: null,
    dentistName: null,
    invitedAt: null,
    activatedAt: null,
  };
  return NextResponse.json({ sharing: status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { childId, dentistEmail } = body || {};
  if (!childId || !dentistEmail) {
    return NextResponse.json(
      { error: "childId and dentistEmail are required" },
      { status: 400 }
    );
  }

  const sharing = upsertDentistInvite(childId, dentistEmail);
  return NextResponse.json({
    success: true,
    sharing,
    message: "Invite sent",
  });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const { childId, action } = body || {};
  if (!childId || !action) {
    return NextResponse.json(
      { error: "childId and action are required" },
      { status: 400 }
    );
  }

  if (action === "activate") {
    const sharing = updateDentistShareStatus(childId, "active");
    return NextResponse.json({ success: true, sharing });
  }

  if (action === "revoke") {
    const sharing = updateDentistShareStatus(childId, "revoked");
    return NextResponse.json({ success: true, sharing });
  }

  return NextResponse.json(
    { error: "Invalid action. Use 'activate' or 'revoke'." },
    { status: 400 }
  );
}


