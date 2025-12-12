// src/app/api/multiuse/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "MultiUseCase";

function flowToFolder(flowType: string): "Gym" | "Charity" | "School" {
  if (flowType === "charity") return "Charity";
  if (flowType === "school") return "School";
  return "Gym";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const scanId = String(form.get("scanId") || "");
    const indexRaw = form.get("index");
    const file = form.get("file") as Blob | null;
    const flowType = (form.get("flowType") as string) || "gym";

    // if userId not sent, default to scanId (no demo-user string)
    const userId = String(form.get("userId") || scanId);

    if (!scanId || !file) {
      return NextResponse.json(
        { ok: false, error: "Missing scanId or file" },
        { status: 400 }
      );
    }

    const index = Number(indexRaw ?? 0);
    const safeIndex = Number.isFinite(index) ? index : 0;

    const flowFolder = flowToFolder(flowType);
    const fileName = `view-${safeIndex + 1}.jpg`;

    // MultiUseCase/<Gym|Charity|School>/<scanId>/<userId>/images/view-x.jpg
    const basePath = `${flowFolder}/${scanId}/${userId}/images`;
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
