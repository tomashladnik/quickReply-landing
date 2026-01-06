/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/lib/dental/demo-sms.ts

const REMOTE_SMS_URL =
  process.env.REPLYQUICK_SMS_URL || "https://dashboard.replyquick.ai";

const RQ_SMS_TOKEN = process.env.RQ_SMS_TOKEN || "";

export interface RemoteSmsResponse {
  success?: boolean;
  error?: string;
  status?: number;
  rawBody?: string;
  [key: string]: any;
}

function normalizePhone(phoneNumber: string) {
  const p = (phoneNumber || "").trim();
  if (!p) return "";

  if (p.startsWith("+")) return p;

  const digits = p.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return p;
}

function resolveSmsEndpoint(baseOrFullUrl: string) {
  const u = (baseOrFullUrl || "").trim().replace(/\/$/, "");
  if (!u) return "/api/sms/send";

  // If they provided the full endpoint already
  if (u.endsWith("/api/sms/send")) return u;

  // Otherwise treat as base URL (e.g. https://dashboard.replyquick.ai or http://localhost:3001)
  return `${u}/api/sms/send`;
}

/**
 * Sends a demo SMS via the main ReplyQuick backend.
 * Demo flow should NOT crash if SMS fails, but we DO want accurate logging.
 */
export async function sendDemoSms(
  phoneNumber: string,
  message: string
): Promise<RemoteSmsResponse> {
  const normalizedPhone = normalizePhone(phoneNumber);

  if (!normalizedPhone) {
    return { success: false, error: "Missing phoneNumber" };
  }
  if (!message) {
    return { success: false, error: "Missing message" };
  }

  const endpoint = resolveSmsEndpoint(REMOTE_SMS_URL);

  let res: Response;

  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(RQ_SMS_TOKEN ? { "x-api-key": RQ_SMS_TOKEN } : {}),
      },
      body: JSON.stringify({
        // IMPORTANT: match your ReplyQuick-v2 /api/sms/send handler
        message,
        phoneNumber: normalizedPhone,
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[sendDemoSms] Network/fetch error", err);
    return { success: false, error: "Network error sending SMS" };
  }

  const contentType = res.headers.get("content-type") || "";
  const rawBody = await res.text().catch(() => "");

  let data: RemoteSmsResponse = {};
  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(rawBody) as RemoteSmsResponse;
    } catch {
      data = {};
    }
  }

  const merged: RemoteSmsResponse = {
    ...data,
    status: res.status,
    rawBody: rawBody || undefined,
  };

  if (!res.ok) {
    const msg =
      merged?.error ||
      (rawBody
        ? `Remote SMS failed (${res.status}): ${rawBody}`
        : `Remote SMS failed with status ${res.status}`);

    console.warn("[sendDemoSms] Remote backend returned error:", msg);
    return { ...merged, success: false, error: msg };
  }

  if (merged?.error) {
    console.warn("[sendDemoSms] Remote backend soft error (2xx):", merged.error);
    return { ...merged, success: false };
  }

  return { ...merged, success: merged.success ?? true };
}
