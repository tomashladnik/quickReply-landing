import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  SUPABASE_SCHOOL_BUCKET,
  supabaseAdmin as supabase,
} from "@/lib/supabase";

const prisma = new PrismaClient();

// Simple helper to map ML brightness score to the 3-level category.
// You can tweak thresholds later once you have the final ML contract.
function mapBrightnessToCategory(brightnessScore: number): string {
  if (brightnessScore >= 0.7) return "All Good";
  if (brightnessScore >= 0.4) return "Needs Attention";
  return "Concern";
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('studentToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as { schoolId: string; studentId: string };
    const { schoolId, studentId } = decoded;

    const formData = await request.formData();
    const centerImage = formData.get("center") as File;
    const leftImage = formData.get("left") as File;
    const rightImage = formData.get("right") as File;
    const upperImage = formData.get("upper") as File;
    const lowerImage = formData.get("lower") as File;

    if (
      !centerImage ||
      !leftImage ||
      !rightImage ||
      !upperImage ||
      !lowerImage
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Optional safety: ensure the student really belongs to this school.
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
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Upload images to Supabase in the required folder structure:
    // School/<school-id>/<student-id>/<timestamp>/{center,left,right,upper,lower}.jpg
    const basePath = `${schoolId}/${studentId}/${timestamp}`;
    const images = [
      { file: centerImage, name: "center.jpg" },
      { file: leftImage, name: "left.jpg" },
      { file: rightImage, name: "right.jpg" },
      { file: upperImage, name: "upper.jpg" },
      { file: lowerImage, name: "lower.jpg" },
    ];

    for (const image of images) {
      const { error } = await supabase.storage
        .from(SUPABASE_SCHOOL_BUCKET)
        .upload(`${basePath}/${image.name}`, image.file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) throw error;
    }

    // Create scan record in DB with "processing" status.
    const scan = await prisma.studentScan.create({
      data: {
        studentId,
        status: "processing",
        timestamp: new Date(),
        submittedAt: new Date(),
      },
    });

    // Build a signed URL for the center image to send to the Whitening endpoint.
    // Signed URLs work even if the bucket doesn't have public access.
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .createSignedUrl(`${basePath}/center.jpg`, 3600); // 1 hour expiry

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to create signed URL:", signedUrlError);
      throw new Error("Failed to generate image access URL");
    }

    const centerPublicUrl = signedUrlData.signedUrl;

    // Call Whitening endpoint (can later be replaced by Analyze Full endpoint).
    interface MLResponse {
      brightness_score?: number;
      [key: string]: unknown;
    }

    let mlData: MLResponse = {};
    let brightness = 0;
    let category = "Processing";

    try {
      console.log("Sending to ML service:", { media_url: centerPublicUrl });
      const mlResponse = await axios.post<MLResponse>(
        "https://ml-service-7irf.onrender.com/v1/whitening",
        {
          media_url: centerPublicUrl,
        },
        {
          timeout: 60_000,
        },
      );

      console.log("ML response:", mlResponse.data);
      mlData = mlResponse.data;
      brightness = typeof mlData.brightness_score === "number"
        ? mlData.brightness_score
        : 0;
      category = mapBrightnessToCategory(brightness);
    } catch (mlError: unknown) {
      console.error("ML analysis failed:", mlError instanceof Error ? mlError.message : String(mlError));
      console.error("ML request URL:", centerPublicUrl);
      // Continue with default values if ML fails
      category = "Processing";
      mlData = {
        error: "ML analysis failed",
        details: mlError instanceof Error ? mlError.message : String(mlError),
        brightness_score: brightness,
        schoolId,
        studentId,
        scanId: scan.id,
        timestamp,
      };
    }

    const mlResultToStore = {
      ...mlData,
      category,
      schoolId,
      studentId,
      scanId: scan.id,
      timestamp,
    };

    // Save ML result JSON in the same folder: ml-result.json
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_SCHOOL_BUCKET)
      .upload(`${basePath}/ml-result.json`, JSON.stringify(mlResultToStore), {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Update scan with final category + completion timestamps.
    await prisma.studentScan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        resultCategory: category,
        completedAt: new Date(),
      },
    });

    // Notify parent via SMS endpoint.
    if (student.parent?.phone) {
      await axios.post("https://dashboard.replyquick.ai/api/sms/send", {
        phone: student.parent.phone,
        message:
          "Your child's dental scan has been submitted. Please check the Parent Portal for details.",
      });
    }

    // Return simple response for frontend.
    return NextResponse.json({
      submitted: true,
      status: "result is processing",
    });
  } catch (error) {
    console.error("Student scan submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
