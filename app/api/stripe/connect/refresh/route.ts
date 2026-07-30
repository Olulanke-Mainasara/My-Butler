import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getURL } from "@/lib/utils";

// Stripe redirects the brand's browser here (a GET) when an onboarding
// account link has expired or was already used - generate a fresh one and
// send them straight back into onboarding instead of dead-ending them.
export async function GET() {
  const baseUrl = getURL();
  const settingsUrl = `${baseUrl}brand-dashboard/settings`;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(settingsUrl);
    }

    const { data: brand } = await supabase
      .from("brands")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (!brand?.stripe_account_id) {
      return NextResponse.redirect(settingsUrl);
    }

    const stripe = getStripe();
    const accountLink = await stripe.accountLinks.create({
      account: brand.stripe_account_id,
      refresh_url: `${baseUrl}api/stripe/connect/refresh`,
      return_url: `${settingsUrl}?stripe=return`,
      type: "account_onboarding",
    });

    return NextResponse.redirect(accountLink.url);
  } catch (error) {
    console.error("Stripe Connect refresh error:", error);
    return NextResponse.redirect(settingsUrl);
  }
}
