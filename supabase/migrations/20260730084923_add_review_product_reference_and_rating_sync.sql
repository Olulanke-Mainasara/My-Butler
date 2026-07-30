-- reviews had no column tying a review to what it's about - user_id,
-- rating, review_text, created_at, nothing else. The product page's
-- "Customer Reviews" tab has been commented out since it has nothing to
-- join against. Fix the structural gap and keep products.rating/
-- reviews_count (denormalized display fields) in sync automatically.

ALTER TABLE public.reviews
  ADD COLUMN product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE;

-- One review per customer per product; resubmitting is an update, not a
-- second row.
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_product_id_user_id_key UNIQUE (product_id, user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- products.rating/reviews_count are denormalized for fast display (product
-- cards, listings) without joining reviews everywhere. SECURITY DEFINER so
-- this can update products regardless of the reviewing customer's own
-- (customer, not brand) RLS permissions on that table.
CREATE OR REPLACE FUNCTION public.update_product_rating_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  target_product_id uuid;
BEGIN
  target_product_id := COALESCE(NEW.product_id, OLD.product_id);

  UPDATE public.products
  SET
    rating = COALESCE(
      (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE product_id = target_product_id AND rating IS NOT NULL),
      0
    ),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = target_product_id)
  WHERE id = target_product_id;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE TRIGGER reviews_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_product_rating_stats();
