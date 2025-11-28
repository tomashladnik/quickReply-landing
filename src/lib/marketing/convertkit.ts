// src/lib/marketing/convertkit.ts
const CONVERTKIT_API_BASE = "https://api.convertkit.com/v3";

type LeadSource = "contact_sales" | "learn_more";

export async function subscribeDentalLeadToConvertKit(
  email: string,
  source: LeadSource
) {
  try {
    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;
    const tagContact = process.env.CONVERTKIT_TAG_CONTACT_SALES;
    const tagLearnMore = process.env.CONVERTKIT_TAG_LEARN_MORE;

    if (!apiKey || !formId) {
      console.warn("[ConvertKit] Missing API config, skipping subscription");
      return;
    }

    const tag = source === "contact_sales" ? tagContact : tagLearnMore;

    const payload: Record<string, unknown> = {
      api_key: apiKey,
      email,
    };

    if (tag) {
      payload.tags = [tag];
    }

    const res = await fetch(`${CONVERTKIT_API_BASE}/forms/${formId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn("[ConvertKit] subscribe failed", res.status, text);
    }
  } catch (err) {
    console.warn("[ConvertKit] error while subscribing lead", err);
  }
}
