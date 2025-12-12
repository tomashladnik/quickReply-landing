import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // once DB fields are ready

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scanId, flow, fullName, phone, email } = body;

    if (!scanId || !flow || !fullName || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "scanId, flow, fullName, and phone are required",
        },
        { status: 400 }
      );
    }

    // TODO: save to DB when schema is ready
    console.log("[MULTIUSE PATIENT]", {
      scanId,
      flow,
      fullName,
      phone,
      email,
    });

    // Later you can:
    // await prisma.scan.update({ ... add patient details ... });

    return NextResponse.json(
      {
        success: true,
        scanId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("multiuse/patient error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
