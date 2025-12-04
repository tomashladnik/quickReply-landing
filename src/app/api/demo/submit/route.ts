/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/demo/submit/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, SUPABASE_DEMO_BUCKET } from "@/lib/supabase";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

// Base ML URL (same envs Rahul gave you)
const RAW_ML_URL =
  process.env.DENTAL_SCAN_ML_URL ||
  process.env.DS_BASE_URL ||
  "https://ml-service-7irf.onrender.com";

const ML_BASE_URL = RAW_ML_URL.replace(/\/+$/, "");

// Map your 5 demo views → ML views used in real app
const VIEW_ORDER = ["left", "right", "front", "top", "bottom"] as const;

// ---- helpers ------------------------------------------------------

// from a *public* Supabase URL, derive the storage path inside the bucket
// e.g. https://.../storage/v1/object/public/dental-demo/dentist/patient/left.jpg
//  -> dentist/patient/left.jpg
function deriveStoragePathFromPublicUrl(
  imageUrl: string,
  bucket: string
): string | null {
  const marker = `/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return imageUrl.substring(idx + marker.length);
}

// same as your existing helper, used for result.json path
function deriveFolderPathFromImageUrl(
  imageUrl: string,
  bucket: string
): string | null {
  const marker = `/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;

  const afterBucket = imageUrl.substring(idx + marker.length);
  const lastSlash = afterBucket.lastIndexOf("/");
  if (lastSlash === -1) return null;

  return afterBucket.substring(0, lastSlash);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body as { token?: string };

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, DEMO_SECRET) as { scanId: string };
    } catch (err) {
      console.error("[DEMO_SUBMIT] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const scan = await prisma.demoScan.findUnique({
      where: { id: payload.scanId },
      include: { patient: true },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const imageUrls = (scan.imageUrls as string[] | null) ?? [];
    if (!imageUrls.length) {
      return NextResponse.json(
        { error: "No images found for this scan" },
        { status: 400 }
      );
    }

    if (!ML_BASE_URL) {
      return NextResponse.json(
        { error: "ML endpoint is not configured on the server" },
        { status: 500 }
      );
    }

    // ----- Build signed URLs for ML (just like real app) -----
    let mlJson: any;

    try {
      const images: { view: string; url: string }[] = [];

      for (let idx = 0; idx < imageUrls.length; idx++) {
        const publicUrl = imageUrls[idx];

        const storagePath = deriveStoragePathFromPublicUrl(
          publicUrl,
          SUPABASE_DEMO_BUCKET
        );

        if (!storagePath) {
          console.error(
            "[DEMO_SUBMIT] Could not derive storage path from image URL",
            publicUrl
          );
          return NextResponse.json(
            { error: "Internal error deriving image path" },
            { status: 500 }
          );
        }

        const { data, error } = await supabaseAdmin.storage
          .from(SUPABASE_DEMO_BUCKET)
          .createSignedUrl(storagePath, 60 * 10);

        if (error || !data?.signedUrl) {
          console.error(
            "[DEMO_SUBMIT] Failed to create signed URL",
            storagePath,
            error
          );
          return NextResponse.json(
            { error: "Failed to sign image URL for ML" },
            { status: 500 }
          );
        }

        images.push({
          view: VIEW_ORDER[idx] ?? "front",
          url: data.signedUrl,
        });
      }

      console.log("[ML] calling", `${ML_BASE_URL}/v1/analyze`, {
        scanId: scan.id,
        patientId: scan.patientId,
        imageCount: images.length,
      });

      const mlRes = await fetch(`${ML_BASE_URL}/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          patient_id: scan.patientId,
        }),
      });

      const ct = mlRes.headers.get("content-type") || "";
      console.log("[ML] status", mlRes.status, ct);

      if (!mlRes.ok) {
        const text = await mlRes.text().catch(() => "");
        console.error(
          "[ML] non-200 response",
          mlRes.status,
          text?.slice(0, 300)
        );
        return NextResponse.json(
          { error: "ML service returned an error" },
          { status: 502 }
        );
      }

      if (!ct.includes("application/json")) {
        const text = await mlRes.text().catch(() => "");
        console.error(
          "[ML] expected JSON, got",
          ct,
          text?.slice(0, 300)
        );
        return NextResponse.json(
          { error: "ML service did not return JSON" },
          { status: 502 }
        );
      }

      mlJson = await mlRes.json();
      console.log("[ML] json", mlJson);
    } catch (e: any) {
      console.error("[ML] request failed", e);
      return NextResponse.json(
        { error: "Failed to call ML service" },
        { status: 502 }
      );
    }

    // ----- Save ML JSON into same patient folder as images -----
    try {
      const firstImageUrl = imageUrls[0];
      const folderPath = deriveFolderPathFromImageUrl(
        firstImageUrl,
        SUPABASE_DEMO_BUCKET
      );

      if (!folderPath) {
        console.error(
          "[DEMO_SUBMIT] Could not derive folder path from image URL",
          firstImageUrl
        );
      } else {
        const jsonPath = `${folderPath}/result.json`;
        const jsonString = JSON.stringify(mlJson, null, 2);
        const jsonBlob = new Blob([jsonString], {
          type: "application/json",
        });

        const { error: jsonUploadError } = await supabaseAdmin.storage
          .from(SUPABASE_DEMO_BUCKET)
          .upload(jsonPath, jsonBlob, {
            contentType: "application/json",
            upsert: true,
          });

        if (jsonUploadError) {
          console.error(
            "[DEMO_SUBMIT] failed to upload ML JSON to Supabase",
            jsonUploadError
          );
        } else {
          console.log(
            "[DEMO_SUBMIT] ML JSON uploaded to Supabase at",
            jsonPath
          );
        }
      }
    } catch (e) {
      console.error("[DEMO_SUBMIT] exception while uploading ML JSON", e);
    }

    // ----- Save result to DemoScan (DB) -----
    const now = new Date();

    await prisma.demoScan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        submittedAt: scan.submittedAt ?? now,
        completedAt: now,
        result: mlJson,
      },
    });

    return NextResponse.json({ success: true, result: mlJson });
  } catch (err) {
    console.error("[DEMO_SUBMIT] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}