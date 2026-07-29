-- Hybrid brand onboarding: brands get immediate self-serve dashboard access
-- (unchanged), but their public-facing listings stay hidden until an admin
-- approves them. Admin status is intentionally NOT a self-assignable
-- role_id - that would reopen the same class of hole just fixed on
-- role_id 2/4, since user_metadata is client-writable at signup. Instead,
-- admin status lives in its own table with no INSERT policy for any client
-- role at all, so it can only ever be granted via direct database access.

ALTER TABLE public.brands
  ADD COLUMN status text NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

CREATE TABLE public.admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admins can confirm their own membership (to gate UI/middleware). No
-- INSERT/UPDATE/DELETE policy exists for any client role - granting or
-- revoking admin status can only be done with direct database access.
CREATE POLICY "Admins can view their own membership" ON public.admins
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- brands: public/other-brand visibility now requires approval; a brand can
-- always see its own row regardless of status.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.brands;
CREATE POLICY "Approved brands are publicly visible" ON public.brands
  FOR SELECT TO public
  USING (status = 'approved' OR auth.uid() = id);

-- products/collections/events/news: same shape - visible if the owning
-- brand is approved, or if the caller IS the owning brand (so a pending
-- brand can still see and manage its own catalog while waiting on review).
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
CREATE POLICY "Products from approved brands are publicly visible" ON public.products
  FOR SELECT TO public
  USING (
    auth.uid() = brand_id
    OR EXISTS (SELECT 1 FROM public.brands WHERE brands.id = products.brand_id AND brands.status = 'approved')
  );

DROP POLICY IF EXISTS "Enable read access for all users" ON public.collections;
CREATE POLICY "Collections from approved brands are publicly visible" ON public.collections
  FOR SELECT TO public
  USING (
    auth.uid() = brand_id
    OR EXISTS (SELECT 1 FROM public.brands WHERE brands.id = collections.brand_id AND brands.status = 'approved')
  );

DROP POLICY IF EXISTS "Enable read access for all users" ON public.events;
CREATE POLICY "Events from approved brands are publicly visible" ON public.events
  FOR SELECT TO public
  USING (
    auth.uid() = brand_id
    OR EXISTS (SELECT 1 FROM public.brands WHERE brands.id = events.brand_id AND brands.status = 'approved')
  );

DROP POLICY IF EXISTS "Enable read access for all users" ON public.news;
CREATE POLICY "Articles from approved brands are publicly visible" ON public.news
  FOR SELECT TO public
  USING (
    auth.uid() = brand_id
    OR EXISTS (SELECT 1 FROM public.brands WHERE brands.id = news.brand_id AND brands.status = 'approved')
  );

-- The only way brands.status can change: an RPC that checks the caller is a
-- real admin (per the admins table, not a client-editable claim).
CREATE OR REPLACE FUNCTION public.update_brand_status(_brand_id uuid, _status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF _status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', _status;
  END IF;

  UPDATE public.brands SET status = _status WHERE id = _brand_id;

  INSERT INTO public.notifications (user_id, type, title, message)
  SELECT
    id,
    'brand_status',
    CASE WHEN _status = 'approved' THEN 'Your brand is live!' ELSE 'Update on your brand application' END,
    CASE
      WHEN _status = 'approved' THEN 'Your brand has been approved. Your products, collections, events, and articles are now visible to customers.'
      WHEN _status = 'rejected' THEN 'Your brand application was not approved. Contact support for details.'
      ELSE 'Your brand application is pending review.'
    END
  FROM public.brands WHERE id = _brand_id;
END;
$function$;
