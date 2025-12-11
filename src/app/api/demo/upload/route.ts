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
    let scanId: string;
    
    if (token.includes('.')) {
      // JWT token - verify normally
      try {
        payload = jwt.verify(token, DEMO_SECRET) as DemoTokenPayload;
        scanId = payload.scanId;
      } catch (err) {
        console.error("[DEMO_UPLOAD] invalid JWT token", err);
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    } else {
      // Simple string token for gym/multiuse - create mock payload
      scanId = `gym-scan-${Date.now()}`;
      payload = {
        scanId: scanId,
        dentistDemoId: "gym-demo",
        patientId: "gym-patient"
      };
    }

    // For JWT tokens, validate scan exists; for simple tokens, create mock
    let scan: any;
    if (token.includes('.')) {
      scan = await prisma.demoScan.findUnique({ where: { id: scanId } });
      if (!scan) {
        return NextResponse.json({ error: "Scan not found" }, { status: 404 });
      }
    } else {
      // Mock scan for gym/multiuse flows
      scan = {
        id: scanId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrls: [],
        submittedAt: null
      };
    }

    // Get the file - check for different field names
    const image = formData.get("file") || formData.get("image");
    const labelField = formData.get("viewType") || formData.get("label");
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
    const dentistFolder =
      payload.dentistDemoId ||
      scan.dentistDemoId ||
      scan.dentistId ||
      "unknown-dentist";
    const patientFolder =
      payload.patientId || scan.patientId || scanId;

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

    // For JWT tokens, update database; for simple tokens, just return success
    if (token.includes('.')) {
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
        scanId: scanId
      });
    } else {
      // Simple token flow - just return success without database update
      return NextResponse.json({
        success: true,
        imageUrl: publicUrl,
        imageUrls: [publicUrl],
        scanId: scanId
      });
    }
  } catch (err) {
    console.error("[DEMO_UPLOAD] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}