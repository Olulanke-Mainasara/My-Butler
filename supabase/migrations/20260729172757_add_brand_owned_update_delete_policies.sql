-- products/collections/events/news had no UPDATE or DELETE policy at all,
-- so RLS denied both by default - not even the owning brand could save an
-- edit or delete their own listing. Add owner-scoped policies for each.

CREATE POLICY "Brands can update their own products" ON public.products
  FOR UPDATE TO authenticated
  USING (auth.uid() = brand_id)
  WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "Brands can delete their own products" ON public.products
  FOR DELETE TO authenticated
  USING (auth.uid() = brand_id);

CREATE POLICY "Brands can update their own collections" ON public.collections
  FOR UPDATE TO authenticated
  USING (auth.uid() = brand_id)
  WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "Brands can delete their own collections" ON public.collections
  FOR DELETE TO authenticated
  USING (auth.uid() = brand_id);

CREATE POLICY "Brands can update their own events" ON public.events
  FOR UPDATE TO authenticated
  USING (auth.uid() = brand_id)
  WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "Brands can delete their own events" ON public.events
  FOR DELETE TO authenticated
  USING (auth.uid() = brand_id);

CREATE POLICY "Brands can update their own articles" ON public.news
  FOR UPDATE TO authenticated
  USING (auth.uid() = brand_id)
  WITH CHECK (auth.uid() = brand_id);
CREATE POLICY "Brands can delete their own articles" ON public.news
  FOR DELETE TO authenticated
  USING (auth.uid() = brand_id);
