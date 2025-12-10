// src/lib/dental/multiuse/upload.ts

type UploadParams = {
  scanId: string;
  index: number;
  blob: Blob;
  flowType?: "gym" | "school" | "charity";
  userId?: string;
};

export async function uploadMultiuseImage({
  scanId,
  index,
  blob,
  flowType = "gym",
  userId = "demo-user",
}: UploadParams): Promise<string> {
  const form = new FormData();
  form.append("scanId", scanId);
  form.append("index", String(index));
  form.append("file", blob);
  form.append("flowType", flowType);
  form.append("userId", userId);

  const res = await fetch("/api/multiuse/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  const data = await res.json();
  if (!data.ok || !data.url) {
    throw new Error("Upload failed: missing url in response");
  }

  return data.url as string;
}