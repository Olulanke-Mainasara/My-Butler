import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, PLATFORM_FEE_PERCENT } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/supabase";

// "Separate charges and transfers": the whole cart is charged to the
// platform's own Stripe balance (see app/api/checkout/route.ts - one
// Checkout Session regardless of how many brands are in the cart), then
// each brand's share is moved out with its own Transfer once payment
// succeeds. Brands that haven't connected Stripe yet (or aren't approved
// for charges) are simply skipped - their order_items keep transfer_id
// null so they can be paid out later once connected.
async function transferOrderProceedsToBrands(
  supabase: SupabaseClient<Database>,
  stripe: Stripe,
  orderId: string,
  paymentIntentId: string | undefined
) {
  const { data: items, error } = await supabase
    .from("order_items")
    .select(
      "id, brand_id, unit_price, quantity, brands(stripe_account_id, stripe_charges_enabled)"
    )
    .eq("order_id", orderId)
    .is("transfer_id", null);

  if (error || !items || items.length === 0) {
    if (error) console.error("Failed to load order items for transfer:", error);
    return;
  }

  let sourceChargeId: string | undefined;
  if (paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      sourceChargeId =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;
    } catch (error) {
      console.error("Failed to retrieve payment intent for transfer source:", error);
    }
  }

  const groups = new Map<
    string,
    { itemIds: string[]; totalCents: number; stripeAccountId: string }
  >();

  for (const item of items) {
    const brand = item.brands;
    if (!brand?.stripe_account_id || !brand.stripe_charges_enabled) continue;

    const existing = groups.get(item.brand_id);
    const itemCents = Math.round(item.unit_price * 100) * item.quantity;

    if (existing) {
      existing.itemIds.push(item.id);
      existing.totalCents += itemCents;
    } else {
      groups.set(item.brand_id, {
        itemIds: [item.id],
        totalCents: itemCents,
        stripeAccountId: brand.stripe_account_id,
      });
    }
  }

  for (const [brandId, group] of groups) {
    const transferCents =
      group.totalCents - Math.round((group.totalCents * PLATFORM_FEE_PERCENT) / 100);
    if (transferCents <= 0) continue;

    try {
      const transfer = await stripe.transfers.create({
        amount: transferCents,
        currency: "usd",
        destination: group.stripeAccountId,
        transfer_group: orderId,
        source_transaction: sourceChargeId,
      });

      await supabase
        .from("order_items")
        .update({ transfer_id: transfer.id, transferred_at: new Date().toISOString() })
        .in("id", group.itemIds);
    } catch (error) {
      console.error(`Failed to transfer proceeds to brand ${brandId}:`, error);
    }
  }
}

// Order items accumulate with transfer_id null whenever they were paid
// before the selling brand had a connected (and charges-enabled) Stripe
// account - see transferOrderProceedsToBrands, which only transfers to
// brands that are already connected at the moment a checkout completes.
// This sweeps a brand's backlog once account.updated reports them as
// newly able to receive charges, grouped back out per paid order so each
// transfer can still use that order's own charge as its source.
async function backfillPendingTransfersForBrand(
  supabase: SupabaseClient<Database>,
  stripe: Stripe,
  brandId: string
) {
  const { data: pendingItems, error } = await supabase
    .from("order_items")
    .select("order_id, orders(status, stripe_payment_intent_id)")
    .eq("brand_id", brandId)
    .is("transfer_id", null);

  if (error) {
    console.error("Failed to load pending order items for backfill:", error);
    return;
  }

  const paidOrders = new Map<string, string | null | undefined>();
  for (const item of pendingItems ?? []) {
    if (item.orders?.status === "paid") {
      paidOrders.set(item.order_id, item.orders.stripe_payment_intent_id);
    }
  }

  for (const [orderId, paymentIntentId] of paidOrders) {
    await transferOrderProceedsToBrands(
      supabase,
      stripe,
      orderId,
      paymentIntentId ?? undefined
    );
  }
}

// Runs with no user session - Stripe calls this server-to-server - so it
// uses the service role client to update orders regardless of who owns
// them. Signature verification is what proves a request actually came from
// Stripe; without it this endpoint would let anyone mark any order paid.
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;
        if (!orderId) break;

        const { data: order, error: updateError } = await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select("customer_id")
          .single();

        if (updateError) {
          console.error("Failed to mark order paid:", updateError);
          break;
        }

        await supabase.from("cart").delete().eq("user_id", order.customer_id);

        await supabase.from("notifications").insert({
          user_id: order.customer_id,
          type: "order",
          title: "Order confirmed!",
          message: "Your payment went through and your order is confirmed.",
        });

        await transferOrderProceedsToBrands(
          supabase,
          stripe,
          orderId,
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id
        );

        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        const chargesEnabled = account.charges_enabled ?? false;

        const { data: brand, error: accountUpdateError } = await supabase
          .from("brands")
          .update({
            stripe_charges_enabled: chargesEnabled,
            stripe_payouts_enabled: account.payouts_enabled ?? false,
          })
          .eq("stripe_account_id", account.id)
          .select("id")
          .single();

        if (accountUpdateError) {
          console.error(
            "Failed to sync Stripe Connect account status:",
            accountUpdateError
          );
          break;
        }

        // Cheap either way (a no-op query when nothing's pending) and
        // catches every case that actually matters: first time this brand
        // becomes chargeable, or Stripe re-sends account.updated after a
        // temporary restriction clears.
        if (chargesEnabled && brand) {
          await backfillPendingTransfersForBrand(supabase, stripe, brand.id);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;
        if (!orderId) break;

        await supabase
          .from("orders")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", orderId)
          .eq("status", "pending");

        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
