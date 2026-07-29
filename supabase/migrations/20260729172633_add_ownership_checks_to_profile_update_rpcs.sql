-- Both RPCs took _supabase_user_id as a caller-supplied argument and updated
-- that row with no check that the caller actually IS that user - and both
-- are callable by the anon role, so this was an unauthenticated way to
-- overwrite any customer/brand's profile. Add an ownership check up front.
CREATE OR REPLACE FUNCTION public.update_customer_details(
  _supabase_user_id uuid, _display_name text, _profile_picture text, _email text, _location text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != _supabase_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this profile';
  END IF;

  BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      raw_user_meta_data,
      '{display_name}',
      to_jsonb(_display_name),
      true
    )
    WHERE id = _supabase_user_id;

    UPDATE public.customers
    SET
      display_name = _display_name,
      profile_picture = _profile_picture,
      email = _email,
      location = _location
    WHERE supabase_user_id = _supabase_user_id;
  END;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_brand_details(
  _supabase_user_id uuid, _name text, _email text, _location text, _description text,
  _url text, _profile_picture text, _contact text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != _supabase_user_id THEN
    RAISE EXCEPTION 'Not authorized to update this profile';
  END IF;

  BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      raw_user_meta_data,
      '{display_name}',
      to_jsonb(_name),
      true
    )
    WHERE id = _supabase_user_id;

    UPDATE public.brands
    SET
      name = _name,
      email = _email,
      location = _location,
      description = _description,
      url = _url,
      profile_picture = _profile_picture,
      contact = _contact
    WHERE supabase_user_id = _supabase_user_id;
  END;
END;
$function$;
