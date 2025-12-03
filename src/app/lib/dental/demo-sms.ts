// src/app/lib/dental/demo-sms.ts
const REMOTE_SMS_URL =
  process.env.REPLYQUICK_SMS_URL ||
  "https://dashboard.replyquick.ai/api/sms/send";

interface RemoteSmsResponse {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

/**
 * Sends a demo SMS via the main ReplyQuick backend.
 * This is a thin wrapper around /api/sms/send that Rahul shared.
 */
export async function sendDemoSms(
  phoneNumber: string,
  message: string
): Promise<RemoteSmsResponse> {
  // You can add auth headers here later if Rahul gives you a token.
  const res = await fetch(REMOTE_SMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "x-api-key": process.env.RQ_SMS_TOKEN ?? "",
    },
    body: JSON.stringify({
      message,
      phoneNumber,
      // we don’t have contactId in demo → leave undefined
    }),
  });

  let data: RemoteSmsResponse = {};
  try {
    data = (await res.json()) as RemoteSmsResponse;
  } catch {
    // ignore JSON parse error, we'll still throw below
  }

  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.error || `Remote SMS failed with status ${res.status}`
    );
  }

  return data;
}