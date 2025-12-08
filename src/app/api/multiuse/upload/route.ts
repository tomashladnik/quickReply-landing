// src/app/api/multiuse/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// use a dedicated env just for this flow
const MULTIUSE_BUCKET = process.env.SUPABASE_BUCKET || "MultiUseCase";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const scanId = form.get("scanId");
    const index = form.get("index");
    const file = form.get("file");

    if (!scanId || typeof scanId !== "string" || !(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, error: "Missing scanId or file" },
        { status: 400 }
      );
    }

    const idx = typeof index === "string" ? Number(index) : 0;
    const fileName = `view-${idx + 1}.jpg`;
    const filePath = `${scanId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(MULTIUSE_BUCKET)
      .upload(filePath, file, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: publicData } = supabase
      .storage
      .from(MULTIUSE_BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({
      ok: true,
      url: publicData.publicUrl,
      path: data.path,
    });
  } catch (err: any) {
    console.error("Upload route crash:", err);
    return NextResponse.json(
      { ok: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
