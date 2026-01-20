// src/app/api/dentalscan/charity-donation/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function getBaseUrl(req: NextRequest) {
  // Works on Vercel + local + custom domains
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const host = req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;

  // Final fallback (only if everything missing)
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://replyquick.ai";
}

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || amount < 1 || amount > 999999) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            // IMPORTANT: product should be under product_data, not product:
            product_data: {
              name: "DentalScan Charity Donation",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dentalscan/charity?success=true`,
      cancel_url: `${baseUrl}/dentalscan/charity?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
