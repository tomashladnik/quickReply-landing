import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEMO_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET ||
  process.env.SUPABASE_BUCKET ||
  "dental-demo";

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

    const path = `meta/${scanId}.json`;

    const { data: downloaded, error: dlError } = await supabase.storage
      .from(DEMO_BUCKET)
      .download(path);

    if (dlError || !downloaded) {
      return NextResponse.json(
        { error: "Scan not found" },
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
