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
