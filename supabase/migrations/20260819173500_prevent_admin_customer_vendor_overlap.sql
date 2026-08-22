-- Migration: prevent an admin account from also registering as a
-- customer or a vendor (brand).
--
-- customers.id, brands.id, and admins.id all reference the SAME
-- auth.users(id). Nothing currently stops a logged-in admin from hitting
-- the normal signup flow and creating a customers or brands row with
-- their own id - every existing check (auth.uid() = id) would pass, since
-- it IS their own account.
--
-- This does NOT block the reverse: promoting an existing customer or
-- vendor to admin is still fine and untouched here, only an admin
-- account creating a second identity as a customer/vendor is blocked.
--
-- Enforced two ways for defense in depth:
--   1. A trigger, which catches every insert path, including the
--      service role key, which RLS cannot see or restrict.
--   2. An updated INSERT policy, so the rule is visible next to your
--      other policies and not just buried in a trigger function.

CREATE OR REPLACE FUNCTION public.prevent_admin_signup_overlap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admins WHERE admins.id = NEW.id) THEN
    RAISE EXCEPTION 'This account is registered as an admin and cannot also register as a %', TG_ARGV[0];
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER prevent_admin_as_customer
  BEFORE INSERT ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_signup_overlap('customer');

CREATE TRIGGER prevent_admin_as_brand
  BEFORE INSERT ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_signup_overlap('vendor');

-- RLS layer: same rule, so it reads consistently with the trigger above.
DROP POLICY IF EXISTS "Users can insert their own customer row" ON public.customers;
CREATE POLICY "Users can insert their own customer row" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND NOT EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
  );

DROP POLICY IF EXISTS "Brands can insert their own row" ON public.brands;
CREATE POLICY "Brands can insert their own row" ON public.brands
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND NOT EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
  );
