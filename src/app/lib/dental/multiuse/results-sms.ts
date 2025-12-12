/* eslint-disable @typescript-eslint/no-explicit-any */

const MULTIUSE_SMS_URL =
  process.env.REPLYQUICK_RESULTS_SMS_URL ||
  "https://dashboard.replyquick.ai/api/sms/send";

type FlowType = "gym" | "charity";

export interface MultiuseSmsResponse {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

/**
 * Send result SMS for Gym / Charity multiuse flows.
 */
export async function sendMultiuseResultSms(opts: {
  phone: string;
  flowType: FlowType;
  scanId: string;
  baseUrl: string; // e.g. req.nextUrl.origin
}): Promise<MultiuseSmsResponse> {
  const { phone, flowType, scanId, baseUrl } = opts;

  const flowPath = flowType === "charity" ? "charity" : "gym";

  const resultUrl = `${baseUrl}/multiusecase/${flowPath}/result?scanId=${encodeURIComponent(
    scanId
  )}`;

  const message =
    flowType === "gym"
      ? `ReplyQuick (DentalScan): Your whitening results are ready. Tap to view: ${resultUrl}. Reply STOP to opt out.`
      : `ReplyQuick (DentalScan): Your priority score report is ready. Tap to view: ${resultUrl}. Reply STOP to opt out.`;

  let res: Response;
  try {
    res = await fetch(MULTIUSE_SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // add auth header here if they give you a token:
        // "x-api-key": process.env.RQ_RESULTS_SMS_TOKEN ?? "",
      },
      body: JSON.stringify({
        phoneNumber: phone,
        message,
      }),
    });
  } catch (err) {
    console.warn("[sendMultiuseResultSms] Network or fetch error", err);
    return { success: false, error: "Network error sending SMS" };
  }

  let data: MultiuseSmsResponse = {};
  try {
    data = (await res.json()) as MultiuseSmsResponse;
  } catch {
    // ignore JSON parse errors if HTTP status is ok
  }

  if (!res.ok) {
    const msg = data?.error || `Multiuse SMS failed with status ${res.status}`;
    console.warn("[sendMultiuseResultSms] backend returned error:", msg);
    return { success: false, error: msg };
  }

  if (data?.error) {
    console.warn(
      "[sendMultiuseResultSms] backend reported soft error with 2xx:",
      data.error
    );
  }

  return data;
}
