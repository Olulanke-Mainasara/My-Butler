import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe";
import { getURL } from "@/lib/utils";

// Brands don't have a client-facing UPDATE policy on their own row (all
// brand writes go through SECURITY DEFINER RPCs or, here, a server route),
// so persisting the new stripe_account_id needs the service role client -
// same pattern as the Stripe webhook.
export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("id, email, stripe_account_id")
      .eq("id", user.id)
      .single();

    if (brandError || !brand) {
      return NextResponse.json(
        { error: "No brand profile found for this account" },
        { status: 403 }
      );
    }

    const stripe = getStripe();
    let accountId = brand.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: brand.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      const serviceRoleClient = createServiceRoleClient();
      const { error: updateError } = await serviceRoleClient
        .from("brands")
        .update({ stripe_account_id: accountId })
        .eq("id", brand.id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    }

    const baseUrl = getURL();
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}api/stripe/connect/refresh`,
      return_url: `${baseUrl}brand-dashboard/settings?stripe=return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to start Stripe onboarding" },
      { status: 500 }
    );
  }
}
