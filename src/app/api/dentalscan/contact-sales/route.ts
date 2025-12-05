import { NextRequest, NextResponse } from "next/server";
import { createDentalLead } from "@/lib/dental/dentalLead";
import { subscribeDentalLeadToConvertKit } from "@/lib/marketing/convertkit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone = body.phone as string | undefined;
    const email = body.email as string | undefined;
    const pagePath = body.pagePath as string | undefined;

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Phone is required" },
        { status: 400 }
      );
    }

    await createDentalLead({
      source: "contact_sales",
      phone,
      email,
      pagePath,
    });

    if (email) {
        await subscribeDentalLeadToConvertKit(email, "contact_sales");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact-sales error", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
