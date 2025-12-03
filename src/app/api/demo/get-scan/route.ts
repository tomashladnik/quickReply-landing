import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase";

const DEMO_SECRET = process.env.DENTAL_DEMO_SECRET || "demo-secret";
const DEMO_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET ||
  process.env.SUPABASE_BUCKET ||
  "dental-demo";

type DemoScanMeta = {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  status: string;
};

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token required" },
        { status: 400 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, DEMO_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const scanId = decoded.scanId as string;
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
    const meta = JSON.parse(text) as DemoScanMeta;

    return NextResponse.json({
      scanId,
      patient_name: meta.patient_name,
      phone: meta.phone,
      email: meta.email,
      status: meta.status,
    });
  } catch (err: any) {
    console.error("Get demo scan error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
