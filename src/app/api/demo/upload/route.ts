import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

const BUCKET_NAME = "dental-demo";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // 👈 matches your .env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[DEMO_UPLOAD] Missing Supabase env vars");
}

// We still create the client, but if envs are missing it will throw inside POST
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured on the server" },
      { status: 500 }
    );
  }  
  try {
    const formData = await req.formData();

    const token = formData.get("token");
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    let payload: any;
    try {
      payload = jwt.verify(token, DEMO_SECRET) as { scanId: string };
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
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    const uploadedUrls: string[] = [];

    // Expect keys like image_0, image_1, ... image_4
    for (let i = 0; i < 5; i++) {
      const key = `image_${i}`;
      const value = formData.get(key);
      if (!value || !(value instanceof Blob)) {
        continue;
      }

      const filePath = `${scanId}/${key}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, value, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("[DEMO_UPLOAD] upload error", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image(s)" },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "No images found in request" },
        { status: 400 }
      );
    }

    const now = new Date();

    await prisma.demoScan.update({
      where: { id: scanId },
      data: {
        imageUrls: uploadedUrls,
        status: "submitted",
        submittedAt: now,
      },
    });

    return NextResponse.json({ success: true, imageUrls: uploadedUrls });
  } catch (err) {
    console.error("[DEMO_UPLOAD] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
