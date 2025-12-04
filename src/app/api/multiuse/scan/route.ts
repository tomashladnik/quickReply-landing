export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import {
  deriveSchoolSimplifiedStatus,
  deriveCharityCarePriority,
  decideMinorRouting,
  type FlowType,
  type SimplifiedStatus,
  type ConsentMethod,
} from "@/lib/dental/multiuse/multicase";

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "dental-scans";

const Body = z.object({
  scanId: z.string().min(1),
  // Optional: if you have a patient/business system, these would be used
  // For now, we'll work with just scanId for the QR flow
  flowType: z.enum(["gym", "school", "charity"]).optional(),
  isMinor: z.boolean().optional(),
  consentMethod: z.enum(["school", "parent"]).optional(),
  hasSchoolConsentOnFile: z.boolean().optional(),
  // Image URLs or file paths for analysis
  images: z
    .array(
      z.object({
        view: z.enum(["front", "left", "right", "top", "bottom"]),
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

function deriveFolderFromPath(path: string) {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx);
}

export async function POST(req: NextRequest) {
  try {
    const {
      scanId,
      flowType,
      isMinor,
      consentMethod,
      hasSchoolConsentOnFile,
      images,
    } = Body.parse(await req.json());

    // Fetch scan record
    const scan = await (prisma as any).scan.findUnique({
      where: { id: scanId },
    });

    if (!scan) {
      return NextResponse.json(
        { ok: false, error: "Scan not found" },
        { status: 404 }
      );
    }

    // Prepare images for ML analysis
    const imageUrls: { view: string; url: string }[] = [];

    if (images && images.length > 0) {
      for (const item of images) {
        if (item.url) {
          imageUrls.push({ view: item.view, url: item.url });
        } else if (item.filePath) {
          // Create signed URL from Supabase storage
          const { data, error } = await supabaseAdmin.storage
            .from(SUPABASE_BUCKET)
            .createSignedUrl(item.filePath, 60 * 10);

          if (error || !data?.signedUrl) {
            return NextResponse.json(
              { ok: false, error: "Failed to sign image URL" },
              { status: 500 }
            );
          }

          imageUrls.push({
            view: item.view,
            url: data.signedUrl,
          });
        }
      }
    }

    // Call ML service if images are provided
    let mlJson: any = null;
    if (imageUrls.length > 0) {
      const mlRes = await fetch(`${ML_BASE_URL}/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: imageUrls,
          scan_id: scanId,
        }),
      });

      if (!mlRes.ok) {
        const text = await mlRes.text().catch(() => "");
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

    // Store ML results in Supabase if available
    let jsonKey: string | null = null;
    if (mlJson) {
      const now = new Date();
      const safeIso = now.toISOString().replace(/[:.]/g, "-");
      jsonKey = `analysis/${scanId}/analysis-${safeIso}.json`;

      await supabaseAdmin.storage
        .from(SUPABASE_BUCKET)
        .upload(jsonKey, JSON.stringify(mlJson, null, 2), {
          contentType: "application/json",
          upsert: true,
        });
    }

    // Build summary from ML results
    const summaryParts: string[] = [];
    if (mlJson?.overall_status) {
      summaryParts.push(`Overall status: ${mlJson.overall_status}`);
    }
    if (mlJson?.quality?.score != null) {
      summaryParts.push(`Quality score: ${mlJson.quality.score}`);
    }
    if (
      Array.isArray(mlJson?.recommendations) &&
      mlJson.recommendations.length
    ) {
      summaryParts.push(`Top recommendation: ${mlJson.recommendations[0]}`);
    }
    const summary = summaryParts.join(" | ") || "Analysis completed";

    // Determine effective flow type
    const effectiveFlowType = flowType || (scan.flowType as FlowType) || "gym";

    // Derive simplified status based on flow
    let simplifiedStatus: SimplifiedStatus | null = null;
    if (effectiveFlowType === "school" && mlJson) {
      simplifiedStatus = deriveSchoolSimplifiedStatus(mlJson);
    } else if (effectiveFlowType === "charity" && mlJson) {
      simplifiedStatus = deriveCharityCarePriority(mlJson);
    }

    // Update scan record with results
    const updateData: any = {
      status: "COMPLETE",
      completedAt: new Date(),
      originalJson: mlJson || scan.originalJson,
      resultJson: mlJson || scan.resultJson,
    };

    if (simplifiedStatus) {
      updateData.simplifiedStatus = simplifiedStatus;
    }

    // Extract whitening data if available
    if (mlJson?.whitening) {
      if (mlJson.whitening.brightness_score !== undefined) {
        updateData.brightnessScore = mlJson.whitening.brightness_score;
      }
      if (mlJson.whitening.shade_value) {
        updateData.shadeValue = mlJson.whitening.shade_value;
      }
      if (mlJson.whitening.ideal_shade) {
        updateData.idealShade = mlJson.whitening.ideal_shade;
      }
    }

    // Update clinic recommendation if available
    if (mlJson?.clinic_recommended !== undefined) {
      updateData.clinicRecommended = mlJson.clinic_recommended;
    }

    const updatedScan = await (prisma as any).scan.update({
      where: { id: scanId },
      data: updateData,
    });

    // Handle minor routing if flow type is school
    if (!flowType) {
      return NextResponse.json({
        ok: true,
        scanId: updatedScan.id,
        result: {
          summary,
          findings: mlJson?.findings || [],
          recommendations: mlJson?.recommendations || [],
        },
        ml: mlJson,
        json_path: jsonKey,
      });
    }

    const minorFlag = !!isMinor;
    const routing = decideMinorRouting({
      flowType: effectiveFlowType as FlowType,
      isMinor: minorFlag,
      consentMethod: consentMethod as ConsentMethod | undefined,
      hasSchoolConsentOnFile,
    });

    // 1) Minors + school consent missing -> block
    if (routing.uiVariant === "BLOCK_NO_CONSENT") {
      return NextResponse.json({
        ok: true,
        scanId: updatedScan.id,
        flowType: effectiveFlowType,
        uiState: "BLOCKED",
        message: "Consent required. Please contact school staff.",
      });
    }

    // 2) Minors, parent route -> minimal message
    if (routing.uiVariant === "MINIMAL_PARENT_ROUTING") {
      return NextResponse.json({
        ok: true,
        scanId: updatedScan.id,
        flowType: effectiveFlowType,
        uiState: "MINIMAL",
        message:
          "Scan complete. Your parent or guardian will receive the report.",
        simplifiedStatus,
      });
    }

    // 3) Minors, school consent OK -> simplified only
    if (routing.uiVariant === "SHOW_SIMPLIFIED_ONLY") {
      return NextResponse.json({
        ok: true,
        scanId: updatedScan.id,
        flowType: effectiveFlowType,
        uiState: "SIMPLIFIED",
        simplifiedStatus,
      });
    }

    // 4) Adults -> full payload
    return NextResponse.json({
      ok: true,
      scanId: updatedScan.id,
      flowType: effectiveFlowType,
      simplifiedStatus,
      result: {
        summary,
        findings: mlJson?.findings || [],
        recommendations: mlJson?.recommendations || [],
        confidence: mlJson?.quality?.score || null,
      },
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
    console.error("[DENTAL/SCAN/ANALYZE] error", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

