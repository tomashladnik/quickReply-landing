import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = process.env.SUPABASE_BUCKET ?? "MultiUseCase";

type UploadOpts = {
  scanId: string;
  index: number;
  blob: Blob;
};

export async function uploadMultiuseImage(opts: UploadOpts): Promise<string> {
  const form = new FormData();
  form.append("scanId", opts.scanId);
  form.append("index", String(opts.index));
  form.append("file", opts.blob, `view-${opts.index + 1}.jpg`);

  const res = await fetch("/api/multiuse/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  const data = await res.json();
  return data.url as string;
}