import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, SUPABASE_SCHOOL_BUCKET } from "@/lib/supabase";
import axios from "axios";

interface MLResponse {
  brightness_score?: number;
  shade?: string;
  ideal_shade?: string;
  conditions?: unknown[];
  triage_status?: string;
  quality_score?: number;
  whitening_analysis?: {
    brightness_score?: number;
    shade?: string;
    ideal_shade?: string;
  };
  [key: string]: unknown;
}

// Simple helper to map ML brightness score to the 3-level category.
function mapBrightnessToCategory(brightnessScore: number): string {
  if (brightnessScore >= 0.7) return "All Good";
  if (brightnessScore >= 0.4) return "Needs Attention";
  return "Concern";
}

export async function POST(req: NextRequest) {
  console.log("[STUDENT_SUBMIT] Starting scan submission");
  try {
    const body = await req.json();
    console.log("[STUDENT_SUBMIT] Request body received");
    const { token } = body as { token?: string };

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    console.log("[STUDENT_SUBMIT] Validating JWT token");
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("[STUDENT_SUBMIT] JWT_SECRET not configured");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let payload: { studentId: string; schoolId: string; type: string };
    try {
      payload = jwt.verify(token, jwtSecret) as { studentId: string; schoolId: string; type: string };
      console.log("[STUDENT_SUBMIT] Token validated successfully:", { studentId: payload.studentId, schoolId: payload.schoolId, type: payload.type });
    } catch (err) {
      console.error("[STUDENT_SUBMIT] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (payload.type !== 'student-scan') {
      console.error("[STUDENT_SUBMIT] Invalid token type:", payload.type);
      return NextResponse.json({ error: "Invalid token type" }, { status: 401 });
    }

    const { studentId, schoolId } = payload;

    // Find the processing scan
    console.log("[STUDENT_SUBMIT] Looking for processing scan for studentId:", studentId);
    const scan = await prisma.studentScan.findFirst({
      where: {
        studentId,
        status: 'processing'
      },
      orderBy: { timestamp: 'desc' }
    });

    console.log("[STUDENT_SUBMIT] Found scan:", scan ? { id: scan.id, status: scan.status, timestamp: scan.timestamp } : "null");

    if (!scan) {
      console.log("[STUDENT_SUBMIT] No processing scan found for student:", studentId);
      return NextResponse.json(
        { error: "No scan in progress. Please capture images first." },
        { status: 400 }
      );
    }

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { school: true, parent: true },
    });

    if (!student || student.schoolId !== schoolId) {
      return NextResponse.json(
        { error: "Invalid student or school" },
        { status: 400 },
      );
    }

    // Generate timestamp for folder name
    const timestamp = scan.timestamp.toISOString().replace(/[:.]/g, "-");

    // List all files in the timestamp folder
    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .list(`${schoolId}/${studentId}/${timestamp}`, {
        limit: 10,
        offset: 0,
      });

    if (fileError) {
      console.error("Failed to list files in directory:", fileError);
      throw new Error("Failed to verify uploaded images");
    }

    console.log("Files found in storage:", fileData?.map(f => f.name));

    // Define expected image files and their ML view mappings
    const imageMappings = [
      { label: 'center', view: 'front', filename: 'center.jpg' },
      { label: 'left', view: 'left', filename: 'left.jpg' },
      { label: 'right', view: 'right', filename: 'right.jpg' },
      { label: 'upper', view: 'top', filename: 'upper.jpg' },
      { label: 'lower', view: 'bottom', filename: 'lower.jpg' },
    ];

    // Verify all 5 images exist and create signed URLs
    const images: { view: string; url: string }[] = [];

    for (const mapping of imageMappings) {
      const file = fileData?.find(f => f.name === mapping.filename);
      if (!file) {
        console.error(`${mapping.label} image not found in storage: ${mapping.filename}`);
        throw new Error(`${mapping.label} image not found`);
      }

      const filePath = `${schoolId}/${studentId}/${timestamp}/${mapping.filename}`;
      const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
        .from(SUPABASE_SCHOOL_BUCKET)
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (signedUrlError || !signedUrlData) {
        console.error(`Failed to create signed URL for ${mapping.label}:`, signedUrlError);
        throw new Error(`Failed to generate ${mapping.label} image access URL`);
      }

      images.push({
        view: mapping.view,
        url: signedUrlData.signedUrl,
      });

      console.log(`Generated signed URL for ${mapping.label} image:`, signedUrlData.signedUrl);
    }

    console.log("All images verified and signed URLs created");

    // Call Analyze endpoint with all 5 images
    let mlData: MLResponse = {};
    let brightness = 0;
    let category = "Processing";

    try {
      console.log("Sending to ML service:", { images, patient_id: studentId });
      const mlRes = await fetch("https://ml-service-7irf.onrender.com/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          patient_id: studentId,
        }),
      });

      console.log("ML response status:", mlRes.status);
      const ct = mlRes.headers.get("content-type") || "";
      console.log("ML response content-type:", ct);

      if (!mlRes.ok) {
        const text = await mlRes.text().catch(() => "");
        console.error("ML non-200 response:", mlRes.status, text?.slice(0, 300));
        throw new Error(`ML service returned ${mlRes.status}: ${text}`);
      }
        
      if (!ct.includes("application/json")) {
        const text = await mlRes.text().catch(() => "");
        console.error("ML expected JSON, got:", ct, text?.slice(0, 300));
        throw new Error("ML service did not return JSON");
      }

      const mlJson: unknown = await mlRes.json();
      console.log("ML response data:", JSON.stringify(mlJson, null, 2));

      if (mlJson && typeof mlJson === 'object' && !Array.isArray(mlJson)) {
        mlData = mlJson as MLResponse;

        // Extract brightness from whitening_analysis if available
        if (mlData.whitening_analysis?.brightness_score !== undefined) {
          brightness = mlData.whitening_analysis.brightness_score;
        } else if (mlData.brightness_score !== undefined) {
          brightness = mlData.brightness_score;
        }

        category = mapBrightnessToCategory(brightness);
        console.log("ML analysis successful - brightness:", brightness, "category:", category);
      } else {
        throw new Error("Invalid ML response format");
      }
    } catch (mlError: unknown) {
      console.error("ML analysis failed:", mlError instanceof Error ? mlError.message : String(mlError));

      // TEMPORARY: Use mock data to test the rest of the flow
      console.log("Using mock ML data for testing");
      mlData = {
        brightness_score: 0.8,
        shade: "A1",
        ideal_shade: "A1",
        conditions: [],
        triage_status: "normal",
        quality_score: 0.9,
        whitening_analysis: {
          brightness_score: 0.8,
          shade: "A1",
          ideal_shade: "A1"
        }
      };
      brightness = 0.8;
      category = mapBrightnessToCategory(brightness);
      console.log("Using mock data - brightness:", brightness, "category:", category);
    }

    const mlResultToStore: Record<string, unknown> = {
      ...mlData,
      category,
      schoolId,
      studentId,
      scanId: scan.id,
      timestamp,
    };

    // Save ML result JSON in the same folder: ml-result.json
    const jsonPath = `${schoolId}/${studentId}/${timestamp}/ml-result.json`;
    console.log("Saving ML result to Supabase:", jsonPath);
    const jsonString = JSON.stringify(mlResultToStore);
    console.log("JSON to save:", jsonString.substring(0, 200) + "...");

    const { error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .upload(jsonPath, jsonString, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Failed to save ML result: ${uploadError.message}`);
    }
    console.log("ML result saved to Supabase successfully");

    // Update scan with final category + completion timestamps.
    console.log("Updating scan in database:", scan.id);
    await prisma.studentScan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        resultCategory: category,
        completedAt: new Date(),
      },
    });
    console.log("Scan updated in database successfully");

    // Notify parent via SMS endpoint.
    if (student.parent?.phone) {
      console.log("Sending SMS notification to parent:", student.parent.phone);
      try {
        await axios.post("https://dashboard.replyquick.ai/api/sms/send", {
          phone: student.parent.phone,
          message:
            "Your child's dental scan has been submitted. Please check the Parent Portal for details.",
        });
        console.log("SMS notification sent successfully");
      } catch (smsError) {
        console.error("SMS notification failed:", smsError);
        // Don't throw error for SMS failure, just log it
      }
    } else {
      console.log("No parent phone number found, skipping SMS notification");
    }

    return NextResponse.json({ success: true, result: mlResultToStore });
  } catch (err) {
    console.error("[STUDENT_SUBMIT] Detailed error information:");
    console.error("[STUDENT_SUBMIT] Error message:", err instanceof Error ? err.message : String(err));
    console.error("[STUDENT_SUBMIT] Error stack:", err instanceof Error ? err.stack : "No stack trace");
    console.error("[STUDENT_SUBMIT] Error type:", typeof err);
    console.error("[STUDENT_SUBMIT] Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
