-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP POLICY "Users can view their own customer profile" ON public.customers;

DROP POLICY "Order items visible to buyer or selling brand" ON public.order_items;

DROP POLICY "Customers can view their own orders" ON public.orders;

CREATE POLICY "Customers visible to self or admin" ON public.customers
  FOR SELECT
  TO authenticated
  USING (((auth.uid() = id) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Order items visible to buyer, selling brand, or admin" ON public.order_items
  FOR SELECT
  TO authenticated
  USING (((auth.uid() = brand_id) OR (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_items.order_id) AND (orders.customer_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Orders visible to owning customer or admin" ON public.orders
  FOR SELECT
  TO authenticated
  USING (((auth.uid() = customer_id) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));
