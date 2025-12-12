/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/demo/upload/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, SUPABASE_DEMO_BUCKET } from "@/lib/supabase";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

type DemoTokenPayload = {
  scanId: string;
  dentistDemoId?: string;
  patientId?: string;
};

function getExtensionFromMimeType(mime: string | null | undefined): string {
  if (!mime) return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  return "jpg";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const token = formData.get("token");
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload: DemoTokenPayload;
    try {
      payload = jwt.verify(token, DEMO_SECRET) as DemoTokenPayload;
    } catch (err) {
      console.error("[DEMO_UPLOAD] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const scanId = payload.scanId;
    const scan = await prisma.demoScan.findUnique({ where: { id: scanId } });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
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

    // Folder structure:
    // dental-demo/<dentist-demo-id>/<patient-id>/<label>.jpg
    const anyScan: any = scan;
    const dentistFolder =
      payload.dentistDemoId ||
      anyScan.dentistDemoId ||
      anyScan.dentistId ||
      "unknown-dentist";
    const patientFolder =
      payload.patientId || anyScan.patientId || scanId;

    const filePath = `${dentistFolder}/${patientFolder}/${label}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_DEMO_BUCKET)
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[DEMO_UPLOAD] upload error", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from(SUPABASE_DEMO_BUCKET)
      .getPublicUrl(filePath);

    // Append URL to existing imageUrls
    const existingUrls =
      scan.imageUrls && Array.isArray(scan.imageUrls)
        ? (scan.imageUrls as string[])
        : [];
    const updatedUrls = [...existingUrls, publicUrl];

    const now = new Date();

    await prisma.demoScan.update({
      where: { id: scanId },
      data: {
        imageUrls: updatedUrls,
        status: "submitted",
        submittedAt: scan.submittedAt ?? now,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      imageUrls: updatedUrls,
    });
  } catch (err) {
    console.error("[DEMO_UPLOAD] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}