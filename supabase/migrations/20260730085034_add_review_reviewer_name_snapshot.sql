-- reviews.user_id points at a customer row, but customers SELECT is
-- locked to auth.uid() = id, so a live join to show a reviewer's name
-- to anyone else silently returns null. Snapshot the name at submission
-- time instead, mirroring the order_items.product_name pattern.

ALTER TABLE public.reviews
  ADD COLUMN reviewer_name text NOT NULL DEFAULT 'Anonymous';

ALTER TABLE public.reviews
  ALTER COLUMN reviewer_name DROP DEFAULT;
