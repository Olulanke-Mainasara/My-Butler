-- cart had no UPDATE/DELETE policy (only INSERT/SELECT), so quantity edits
-- and removals from the cart page can't go through the client at all right
-- now. Add both, owner-scoped.
CREATE POLICY "Users can update their own cart" ON public.cart
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart items" ON public.cart
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Orders: created by the customer (via the checkout API route, using their
-- own session) as 'pending', then flipped to 'paid'/'cancelled' by the
-- Stripe webhook, which runs with no user session and uses the service role
-- key to bypass RLS - so there's no UPDATE policy for any client role here,
-- only the service role can transition status.
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  total_amount numeric NOT NULL,
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create their own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- order_items snapshot product name/price at purchase time - prices change,
-- and an order should show what was actually paid for, not today's price.
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  brand_id uuid NOT NULL REFERENCES public.brands(id),
  product_name text NOT NULL,
  unit_price numeric NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Visible to the buyer (via their order) or the selling brand.
CREATE POLICY "Order items visible to buyer or selling brand" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    auth.uid() = brand_id
    OR EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );

CREATE POLICY "Customers can add items to their own pending orders" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_id AND orders.customer_id = auth.uid())
  );
