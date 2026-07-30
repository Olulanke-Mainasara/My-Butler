import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

// Login links are single-use and expire almost immediately, so this is
// generated fresh on demand rather than stored - the brand clicks
// "View Stripe Dashboard" and lands straight in their own Express
// Dashboard to see payout history without ever needing a stripe.com
// account of their own.
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
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (brandError || !brand?.stripe_account_id) {
      return NextResponse.json(
        { error: "No connected Stripe account found for this brand" },
        { status: 403 }
      );
    }

    const stripe = getStripe();
    const loginLink = await stripe.accounts.createLoginLink(
      brand.stripe_account_id
    );

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("Stripe Connect dashboard link error:", error);
    return NextResponse.json(
      { error: "Failed to open the Stripe dashboard" },
      { status: 500 }
    );
  }
}
