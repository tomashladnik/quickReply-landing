export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "MultiUseCase";

const Body = z.object({
  scanId: z.string().min(1),
  flowType: z.enum(["gym", "school", "charity"]).optional(),
  isMinor: z.boolean().optional(),
  consentMethod: z.enum(["school", "parent"]).optional(),
  hasSchoolConsentOnFile: z.boolean().optional(),
  userId: z.string().optional(),
  images: z
    .array(
      z.object({
        view: z.enum(["front", "left", "right", "upper", "lower"]),
        url: z.string().url().optional(),
        filePath: z.string().optional(),
      })
    )
    .min(1)
    .optional(),
});

const ML_BASE_URL =
  process.env.DENTAL_SCAN_ML_URL ||
  process.env.DS_BASE_URL ||
  "http://127.0.0.1:8000";

type ViewType = "front" | "left" | "right" | "upper" | "lower";

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.parse(await req.json());
    const {
      scanId,
      flowType = "gym",
      images,
    } = parsed;

    const userId = parsed.userId || "anon";
    const flowFolder = flowType === "charity" ? "Charity" : "Gym";
    const effectiveUserId = userId || "demo-user";

    if (!images || images.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No images provided" },
        { status: 400 }
      );
    }

    const imageUrls: { view: ViewType; url: string }[] = [];

    for (const item of images) {
      if (item.url) {
        imageUrls.push({ view: item.view as ViewType, url: item.url });
      } else if (item.filePath) {
        const { data, error } = await supabaseAdmin.storage
          .from(SUPABASE_BUCKET)
          .createSignedUrl(item.filePath, 60 * 10);

        if (error || !data?.signedUrl) {
          console.error("[MULTIUSE/SCAN] Failed to sign image", error);
          return NextResponse.json(
            { ok: false, error: "Failed to sign image URL" },
            { status: 500 }
          );
        }

        imageUrls.push({
          view: item.view as ViewType,
          url: data.signedUrl,
        });
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid image URLs" },
        { status: 400 }
      );
    }

    const mlImages = imageUrls.map(({ view, url }) => ({
      view:
        view === "upper"
          ? "top"
          : view === "lower"
          ? "bottom"
          : view, // front | left | right stay the same
      url,
    }));

    console.log("[MULTIUSE/SCAN] ML payload images:", mlImages);

    // Call ML service
    let mlJson: any = null;
    if (imageUrls.length > 0) {
      const mlRes = await fetch(`${ML_BASE_URL}/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: mlImages,
          scan_id: scanId,
          flow_type: flowType,
        }),
      });

      if (!mlRes.ok) {
        const text = await mlRes.text().catch(() => "");
        console.error("[MULTIUSE/SCAN] ML error:", text);
        return NextResponse.json(
          {
            ok: false,
            error: "ML service error",
            details: text?.slice(0, 500),
          },
          { status: 502 }
        );
      }

      mlJson = await mlRes.json();
    }

    // Store ML results in Supabase
    let jsonKey: string | null = null;
    if (mlJson) {
      const now = new Date();
      const safeIso = now.toISOString().replace(/[:.]/g, "-");

      jsonKey = `${flowFolder}/${scanId}/${effectiveUserId}/analysis-${safeIso}.json`;

      const { error } = await supabaseAdmin.storage
        .from(SUPABASE_BUCKET)
        .upload(jsonKey, JSON.stringify(mlJson, null, 2), {
          contentType: "application/json",
          upsert: true,
        });

      if (error) {
        console.error("[MULTIUSE/SCAN] Failed to upload analysis JSON:", error);
      }
    }

    const summaryParts: string[] = [];
    if (mlJson?.overall_status) {
      summaryParts.push(`Overall status: ${mlJson.overall_status}`);
    }
    if (mlJson?.quality?.score != null) {
      summaryParts.push(`Quality score: ${mlJson.quality.score}`);
    }
    const summary = summaryParts.join(" | ") || "Analysis completed";

    return NextResponse.json({
      ok: true,
      scanId,
      flowType,
      summary,
      ml: mlJson,
      json_path: jsonKey,
    });
  } catch (err: any) {
    // Zod validation error
    if (err?.issues) {
      return NextResponse.json(
        {
          ok: false,
          error: err.issues.map((i: any) => i.message).join(", "),
        },
        { status: 400 }
      );
    }
    console.error("[MULTIUSE/SCAN] error", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}