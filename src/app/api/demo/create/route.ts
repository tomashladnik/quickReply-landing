/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/demo/create/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // service client
import jwt from "jsonwebtoken";

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
  status: "link_sent" | "submitted" | "completed";
  image_urls?: string[];
  result?: any;
  created_at: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const scanId = crypto.randomUUID();

    const meta: DemoScanMeta = {
      id: scanId,
      patient_name: name,
      phone,
      email,
      status: "link_sent",
      created_at: new Date().toISOString(),
    };

    const path = `meta/${scanId}.json`;
    const json = JSON.stringify(meta, null, 2);

    const { error: uploadError } = await supabase.storage
      .from(DEMO_BUCKET)
      .upload(path, json, {
        upsert: true,
        contentType: "application/json",
      });

    if (uploadError) throw uploadError;

    const scanToken = jwt.sign({ scanId }, DEMO_SECRET, {
      expiresIn: "30d",
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const scanUrl = `${baseUrl}/dental-scan-demo?token=${scanToken}`;

    return NextResponse.json({
      ok: true,
      scanId,
      scanUrl,
      patient: {
        name,
        phone,
        email,
      },
    });
  } catch (err: any) {
    console.error("Create demo patient error:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
