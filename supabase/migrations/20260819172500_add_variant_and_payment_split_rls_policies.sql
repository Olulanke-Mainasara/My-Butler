-- Migration: RLS policies for product_variants and payment_splits
-- Run this after 20260819172000_replace_stripe_connect_with_paystack_and_add_variants.sql
--
-- Ownership pattern matches the rest of the schema: brands.id IS the
-- owning user's auth.uid() (not a separate supabase_user_id lookup), so
-- ownership checks compare auth.uid() directly against brand_id columns,
-- same as the existing products/collections/events/news policies.
--
-- Admin access follows the existing pattern too: admins can SELECT more
-- than regular users, but mutations stay owner-only. Admin status has no
-- self-serve write path anywhere else in this schema (see the admins
-- table migration), so payment_splits and product_variants don't get a
-- blanket admin write policy either. If an admin ever needs to correct a
-- row, that should go through a SECURITY DEFINER RPC like
-- update_brand_status, not a raw table policy.

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_splits ENABLE ROW LEVEL SECURITY;

-- ============================
-- product_variants
-- ============================

-- Visible if the parent product is visible: the product's own brand is
-- approved, the caller IS the owning brand, or the caller is an admin.
-- Mirrors "Products visible if approved, own, or admin" one level down,
-- so a pending brand's variants don't leak before the product itself does.
CREATE POLICY "Variants visible if parent product is visible" ON public.product_variants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_variants.product_id
        AND (
          auth.uid() = products.brand_id
          OR EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = products.brand_id AND brands.status = 'approved'
          )
          OR EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
        )
    )
  );

CREATE POLICY "Brands can insert variants for their own products" ON public.product_variants
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_variants.product_id
        AND products.brand_id = auth.uid()
    )
  );

CREATE POLICY "Brands can update variants for their own products" ON public.product_variants
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_variants.product_id
        AND products.brand_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_variants.product_id
        AND products.brand_id = auth.uid()
    )
  );

CREATE POLICY "Brands can delete variants for their own products" ON public.product_variants
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_variants.product_id
        AND products.brand_id = auth.uid()
    )
  );

-- ============================
-- payment_splits
-- ============================
-- Sensitive: payout amounts. Selling brand can view their own rows, admin
-- can view all. No INSERT/UPDATE/DELETE policy for any client role - these
-- rows are written exclusively by the backend webhook handler using the
-- service role key, which bypasses RLS entirely. Consistent with this
-- schema's existing rule that sensitive writes go through a guarded path,
-- not a client-facing policy.

CREATE POLICY "Payment splits visible to selling brand or admin" ON public.payment_splits
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = brand_id)
    OR (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()))
  );
