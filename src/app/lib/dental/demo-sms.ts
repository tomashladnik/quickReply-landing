/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/lib/dental/demo-sms.ts

const REMOTE_SMS_URL =
  process.env.REPLYQUICK_SMS_URL ||
  "https://dashboard.replyquick.ai/api/sms/send";

export interface RemoteSmsResponse {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

export async function sendDemoSms(
  phoneNumber: string,
  message: string
): Promise<RemoteSmsResponse> {
  let res: Response;

  try {
    res = await fetch(REMOTE_SMS_URL, {
      method: "POST",
      redirect: "manual", // ✅ prevents silent /login redirect
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.RQ_SMS_TOKEN ?? "", // ✅ REQUIRED
      },
      body: JSON.stringify({
        message,
        phoneNumber,
        demo: true, // ✅ tells dashboard: don't require user/thread
      }),
    });
  } catch (err) {
    console.warn("[sendDemoSms] Network or fetch error", err);
    return { success: false, error: "Network error sending SMS" };
  }

  // ✅ Detect redirect (login protection) clearly
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    console.warn("[sendDemoSms] Redirect detected", {
      status: res.status,
      location,
      url: REMOTE_SMS_URL,
    });
    return {
      success: false,
      error: `Redirected (${res.status}) to ${location ?? "unknown"}`,
    };
  }

  let data: RemoteSmsResponse = {};
  const text = await res.text();

  try {
    data = text ? (JSON.parse(text) as RemoteSmsResponse) : {};
  } catch {
    // if response isn't json, keep raw
    data = { raw: text } as any;
  }

  if (!res.ok) {
    const msg = (data as any)?.error || `Remote SMS failed with status ${res.status}`;
    console.warn("[sendDemoSms] Remote backend returned error:", {
      status: res.status,
      msg,
      body: data,
    });
    return { success: false, error: msg, status: res.status, body: data } as any;
  }

  // If backend doesn't return success=true, treat it as soft failure
  if ((data as any)?.success !== true) {
    const msg = (data as any)?.error || "Remote SMS did not confirm success";
    console.warn("[sendDemoSms] Soft failure:", msg, data);
    return { success: false, error: msg, body: data } as any;
  }

  return data;
}
