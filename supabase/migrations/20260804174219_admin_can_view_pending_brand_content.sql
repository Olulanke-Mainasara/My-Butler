-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP POLICY "Approved brands are publicly visible" ON public.brands;

DROP POLICY "Collections from approved brands are publicly visible" ON public.collections;

DROP POLICY "Events from approved brands are publicly visible" ON public.events;

DROP POLICY "Articles from approved brands are publicly visible" ON public.news;

DROP POLICY "Products from approved brands are publicly visible" ON public.products;

CREATE POLICY "Brands visible if approved, own, or admin" ON public.brands
  FOR SELECT
  USING (((status = 'approved'::text) OR (auth.uid() = id) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Collections visible if approved, own, or admin" ON public.collections
  FOR SELECT
  USING (((auth.uid() = brand_id) OR (EXISTS ( SELECT 1
   FROM public.brands
  WHERE ((brands.id = collections.brand_id) AND (brands.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Events visible if approved, own, or admin" ON public.events
  FOR SELECT
  USING (((auth.uid() = brand_id) OR (EXISTS ( SELECT 1
   FROM public.brands
  WHERE ((brands.id = events.brand_id) AND (brands.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Articles visible if approved, own, or admin" ON public.news
  FOR SELECT
  USING (((auth.uid() = brand_id) OR (EXISTS ( SELECT 1
   FROM public.brands
  WHERE ((brands.id = news.brand_id) AND (brands.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));

CREATE POLICY "Products visible if approved, own, or admin" ON public.products
  FOR SELECT
  USING (((auth.uid() = brand_id) OR (EXISTS ( SELECT 1
   FROM public.brands
  WHERE ((brands.id = products.brand_id) AND (brands.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM public.admins
  WHERE (admins.id = auth.uid())))));
