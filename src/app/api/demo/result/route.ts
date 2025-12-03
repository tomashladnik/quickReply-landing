// src/app/api/demo/result/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabase, SUPABASE_DEMO_BUCKET } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

function deriveFolderPathFromImageUrl(
  imageUrl: string,
  bucket: string
): string | null {
  const marker = `/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;

  const afterBucket = imageUrl.substring(idx + marker.length); // e.g. "demo/patient123/image_0.jpg"
  const lastSlash = afterBucket.lastIndexOf("/");
  if (lastSlash === -1) return null;

  return afterBucket.substring(0, lastSlash); // "demo/patient123"
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get("scanId");

    if (!scanId) {
      return NextResponse.json(
        { error: "scanId is required" },
        { status: 400 }
      );
    }

    const scan = await prisma.demoScan.findUnique({
      where: { id: scanId },
    });

    if (!scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    const imageUrls = (scan.imageUrls as string[] | null) ?? [];
    if (!imageUrls.length) {
      return NextResponse.json(
        { error: "No images found for this scan" },
        { status: 404 }
      );
    }

    const firstImageUrl = imageUrls[0];
    const folderPath = deriveFolderPathFromImageUrl(
      firstImageUrl,
      SUPABASE_DEMO_BUCKET
    );

    if (!folderPath) {
      console.error(
        "[DEMO_RESULT] Could not derive folder path from image URL",
        firstImageUrl
      );
      return NextResponse.json(
        { error: "Result path could not be derived" },
        { status: 500 }
      );
    }

    const jsonPath = `${folderPath}/result.json`;

    const { data: downloaded, error: dlError } = await supabase.storage
      .from(SUPABASE_DEMO_BUCKET)
      .download(jsonPath);

    if (dlError || !downloaded) {
      console.error("[DEMO_RESULT] download error", dlError);
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    const text = await downloaded.text();
    const meta = JSON.parse(text);

    return NextResponse.json(meta);
  } catch (err: any) {
    console.error("Get demo result error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
