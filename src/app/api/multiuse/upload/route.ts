import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "MultiUseCase";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const scanId = String(form.get("scanId") || "");
    const indexRaw = form.get("index");
    const file = form.get("file") as Blob | null;
    const flowType = (form.get("flowType") as string) || "gym";
    const userId = (form.get("userId") as string) || "demo-user";

    if (!scanId || !file) {
      return NextResponse.json(
        { ok: false, error: "Missing scanId or file" },
        { status: 400 }
      );
    }

    const index = Number(indexRaw ?? 0);
    const safeIndex = Number.isFinite(index) ? index : 0;

    const flowFolder = flowType === "charity" ? "Charity" : "Gym";
    const fileName = `view-${safeIndex + 1}.jpg`;
    const basePath = `${flowFolder}/${scanId}/${userId}`;
    const filePath = `${basePath}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[MULTIUSE/UPLOAD] upload error", uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      url: publicUrlData.publicUrl,
      filePath,
    });
  } catch (err: any) {
    console.error("[MULTIUSE/UPLOAD] error", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}