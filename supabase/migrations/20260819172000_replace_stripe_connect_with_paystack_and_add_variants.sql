-- Migration: Paystack marketplace updates
-- Replaces Stripe Connect fields (not usable for Nigerian vendor payouts)
-- with Paystack subaccount/split fields, adds product variants,
-- per-vendor order fulfilment status, and payment split tracking.

-- 1. Brands: replace Stripe Connect fields with Paystack subaccount fields
alter table public.brands
  drop column if exists stripe_account_id,
  drop column if exists stripe_charges_enabled,
  drop column if exists stripe_payouts_enabled;

alter table public.brands
  add column paystack_subaccount_code text,
  add column payout_bank_code text,
  add column payout_account_number text,
  add column payout_account_name text,
  add column payout_verified boolean not null default false,
  add column commission_rate numeric(5,2) not null default 10.00;

-- 2. Orders: replace Stripe fields with Paystack reference, add shipping address
alter table public.orders
  drop column if exists stripe_checkout_session_id,
  drop column if exists stripe_payment_intent_id;

alter table public.orders
  add column paystack_reference text,
  add column shipping_address jsonb;

-- 3. Product variants (size / color / per-variant stock)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text,
  color text,
  sku text,
  stock_quantity integer not null default 0,
  price_override numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_product_variants_product_id on public.product_variants(product_id);

-- 4. Cart: track which variant the buyer selected
alter table public.cart
  add column variant_id uuid references public.product_variants(id);

-- 5. Order items: per-vendor fulfilment status, variant tracking
--    (drop Stripe-specific transfer fields, they don't apply to Paystack splits)
alter table public.order_items
  drop column if exists transfer_id,
  drop column if exists transferred_at;

alter table public.order_items
  add column variant_id uuid references public.product_variants(id),
  add column status text not null default 'pending',
  add column vendor_amount numeric;

alter table public.order_items
  add constraint order_items_status_check
  check (status in ('pending', 'shipped', 'delivered', 'cancelled'));

-- 6. Payment splits: log what each vendor was actually paid per order
--    (for reconciliation, disputes, and payout history views)
create table public.payment_splits (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  subaccount_code text not null,
  gross_amount numeric not null,
  commission_amount numeric not null,
  net_amount numeric not null,
  created_at timestamptz default now()
);

create index idx_payment_splits_order_id on public.payment_splits(order_id);
create index idx_payment_splits_brand_id on public.payment_splits(brand_id);
