import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, SUPABASE_SCHOOL_BUCKET } from "@/lib/supabase";

const jwtSecret = process.env.JWT_SECRET;

function getExtensionFromMimeType(mime: string | null | undefined): string {
  if (!mime) return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  return "jpg";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const token = formData.get("token");
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload: { studentId: string; schoolId: string; type: string };
    try {
      payload = jwt.verify(token, jwtSecret!) as { studentId: string; schoolId: string; type: string };
    } catch (err) {
      console.error("[STUDENT_UPLOAD] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (payload.type !== 'student-scan') {
      return NextResponse.json({ error: "Invalid token type" }, { status: 401 });
    }

    const { studentId, schoolId } = payload;

    // Find or create a processing scan
    let scan = await prisma.studentScan.findFirst({
      where: {
        studentId,
        status: 'processing'
      },
      orderBy: { timestamp: 'desc' }
    });

    if (!scan) {
      scan = await prisma.studentScan.create({
        data: {
          studentId,
          status: "processing",
          timestamp: new Date(),
          submittedAt: new Date(),
        },
      });
    }

    // Single image + label per request
    const image = formData.get("image");
    const labelField = formData.get("label");
    const label =
      typeof labelField === "string" && labelField.trim()
        ? labelField.toLowerCase()
        : "image";

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { error: "No image found in request" },
        { status: 400 }
      );
    }

    const file = image as File;
    const mimeType = file.type || "image/jpeg";
    const ext = getExtensionFromMimeType(mimeType);

    // Generate timestamp for folder name
    const timestamp = scan.timestamp.toISOString().replace(/[:.]/g, "-");

    // Folder structure: schoolId/studentId/timestamp/label.ext
    const filePath = `${schoolId}/${studentId}/${timestamp}/${label}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[STUDENT_UPLOAD] upload error", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
    });
  } catch (err) {
    console.error("[STUDENT_UPLOAD] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
