import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = body.email as string | undefined;
    const pagePath = body.pagePath as string | undefined;
    const utmSource = body.utmSource as string | undefined;
    const utmMedium = body.utmMedium as string | undefined;
    const utmCampaign = body.utmCampaign as string | undefined;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await createDentalLead({
      source: "learn_more",
      email,
      pagePath,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    await subscribeDentalLeadToConvertKit(email, "learn_more");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("learn-more error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
