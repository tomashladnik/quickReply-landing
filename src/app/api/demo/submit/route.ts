import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const DEMO_SECRET = process.env.DEMO_DENTAL_SECRET || "demo-secret";

// Base ML URL (same envs Rahul gave you)
const RAW_ML_URL =
  process.env.DENTAL_SCAN_ML_URL ||
  process.env.DS_BASE_URL ||
  "https://ml-service-7irf.onrender.com";

const ML_BASE_URL = RAW_ML_URL.replace(/\/+$/, "");

// Map your 5 demo views → ML views used in real app
const VIEW_ORDER = ["left", "right", "front", "top", "bottom"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body as { token?: string };

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, DEMO_SECRET) as { scanId: string };
    } catch (err) {
      console.error("[DEMO_SUBMIT] invalid token", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const scan = await prisma.demoScan.findUnique({
      where: { id: payload.scanId },
      include: { patient: true },
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
        { status: 400 }
      );
    }

    if (!ML_BASE_URL) {
      return NextResponse.json(
        { error: "ML endpoint is not configured on the server" },
        { status: 500 }
      );
    }

    // ----- Call REAL ML service at /v1/analyze -----
    let mlJson: any;

    try {
      const images = imageUrls.map((url, idx) => ({
        view: VIEW_ORDER[idx] ?? "front",
        url,
      }));

      console.log("[ML] calling", `${ML_BASE_URL}/v1/analyze`, {
        scanId: scan.id,
        patientId: scan.patientId,
        imageCount: images.length,
      });

      const mlRes = await fetch(`${ML_BASE_URL}/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          patient_id: scan.patientId,
        }),
      });

      const ct = mlRes.headers.get("content-type") || "";
      console.log("[ML] status", mlRes.status, ct);

      if (!mlRes.ok) {
        const text = await mlRes.text().catch(() => "");
        console.error(
          "[ML] non-200 response",
          mlRes.status,
          text?.slice(0, 300)
        );
        return NextResponse.json(
          { error: "ML service returned an error" },
          { status: 502 }
        );
      }

      if (!ct.includes("application/json")) {
        const text = await mlRes.text().catch(() => "");
        console.error(
          "[ML] expected JSON, got",
          ct,
          text?.slice(0, 300)
        );
        return NextResponse.json(
          { error: "ML service did not return JSON" },
          { status: 502 }
        );
      }

      mlJson = await mlRes.json();
      console.log("[ML] json", mlJson);
    } catch (e: any) {
      console.error("[ML] request failed", e);
      return NextResponse.json(
        { error: "Failed to call ML service" },
        { status: 502 }
      );
    }

    // ----- Save result to DemoScan -----
    const now = new Date();

    await prisma.demoScan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        submittedAt: scan.submittedAt ?? now,
        completedAt: now,
        // store EXACT ML JSON
        result: mlJson,
      },
    });

    return NextResponse.json({ success: true, result: mlJson });
  } catch (err) {
    console.error("[DEMO_SUBMIT] error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}