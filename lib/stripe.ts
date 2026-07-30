import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Lazily constructed so a missing STRIPE_SECRET_KEY doesn't crash the whole
// server on boot - it only throws when a route actually tries to use Stripe.
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set - required for checkout and the Stripe webhook."
    );
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}

// The platform's cut of every sale, taken out of the transfer to the
// selling brand's connected account (see the webhook's "separate charges
// and transfers" handling). Not a Stripe concept itself - just how much of
// each brand's total we keep before transferring the rest.
export const PLATFORM_FEE_PERCENT = 10;
