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

/**
 * Sends a demo SMS via the main ReplyQuick backend.
 * For demo flows, we NEVER throw on logical errors like
 * "No user found associated with this contact" – we just log them.
 */
export async function sendDemoSms(
  phoneNumber: string,
  message: string
): Promise<RemoteSmsResponse> {
  let res: Response;
  try {
    res = await fetch(REMOTE_SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "x-api-key": process.env.RQ_SMS_TOKEN ?? "",
      },
      body: JSON.stringify({
        message,
        phoneNumber,
        // we don’t have contactId in this demo → leave undefined
      }),
    });
  } catch (err) {
    console.warn("[sendDemoSms] Network or fetch error", err);
    // Treat as soft failure, but don't throw
    return { success: false, error: "Network error sending SMS" };
  }

  let data: RemoteSmsResponse = {};
  try {
    data = (await res.json()) as RemoteSmsResponse;
  } catch {
    // if JSON parse fails but HTTP is ok, just ignore
  }

  if (!res.ok) {
    const msg =
      data?.error || `Remote SMS failed with status ${res.status}`;
    console.warn("[sendDemoSms] Remote backend returned error:", msg);
    // Still DO NOT throw — demo should continue
    return { success: false, error: msg };
  }

  if (data?.error) {
    console.warn(
      "[sendDemoSms] Remote backend reported soft error with 2xx:",
      data.error
    );
  }

  return data;
}
