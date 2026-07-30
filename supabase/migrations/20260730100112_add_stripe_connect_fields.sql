-- Brands need a Stripe Connect account to actually receive payouts. Today
-- 100% of checkout proceeds land in the platform's own Stripe account with
-- no way to move a brand's share out. stripe_account_id links a brand to
-- its Express connected account; charges_enabled/payouts_enabled mirror
-- Stripe's own account flags (kept in sync via the account.updated webhook
-- event) so the app can tell "connected" apart from "connected and can
-- actually receive money".
ALTER TABLE public.brands
  ADD COLUMN stripe_account_id text,
  ADD COLUMN stripe_charges_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN stripe_payouts_enabled boolean NOT NULL DEFAULT false;

-- No client-facing UPDATE policy needed for these three columns, matching
-- the existing brands table: all writes to brands go through either a
-- SECURITY DEFINER RPC (update_brand_details) or, for these Stripe fields,
-- server-side routes using the service role client (the Connect onboarding
-- route and the Stripe webhook) after verifying the caller's identity in
-- application code.

-- order_items tracks whether the selling brand's cut of a paid order has
-- actually been transferred out of the platform's Stripe balance yet
-- (see the "separate charges and transfers" note in the webhook).
ALTER TABLE public.order_items
  ADD COLUMN transfer_id text,
  ADD COLUMN transferred_at timestamptz;
