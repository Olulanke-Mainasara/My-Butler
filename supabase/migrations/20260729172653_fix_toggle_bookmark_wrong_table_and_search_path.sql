-- toggle_bookmark operated on `cart` instead of `bookmarks`, and referenced
-- target_id/target_type columns that only exist on `bookmarks` - every call
-- threw "column target_id does not exist" against `cart`. Point it at the
-- right table. toggle_cart was already correct; both get search_path pinned.
CREATE OR REPLACE FUNCTION public.toggle_bookmark(_target_id uuid, _target_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  existing_bookmark public.bookmarks%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT * INTO existing_bookmark
  FROM public.bookmarks
  WHERE user_id = auth.uid()
    AND target_id = _target_id;

  IF FOUND THEN
    DELETE FROM public.bookmarks
    WHERE user_id = auth.uid()
      AND target_id = _target_id;
    RETURN 'removed';
  ELSE
    INSERT INTO public.bookmarks (user_id, target_id, target_type)
    VALUES (auth.uid(), _target_id, _target_type);
    RETURN 'added';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error toggling bookmark: %', SQLERRM;
END;
$function$;

CREATE OR REPLACE FUNCTION public.toggle_cart(_item_id uuid, _quantity integer, _item_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  existing_cart_item public.cart%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT * INTO existing_cart_item
  FROM public.cart
  WHERE user_id = auth.uid()
    AND item_id = _item_id;

  IF FOUND THEN
    DELETE FROM public.cart
    WHERE user_id = auth.uid()
      AND item_id = _item_id;
    RETURN 'removed';
  ELSE
    INSERT INTO public.cart (user_id, item_id, item_type, quantity)
    VALUES (auth.uid(), _item_id, _item_type, _quantity);
    RETURN 'added';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error toggling cart: %', SQLERRM;
END;
$function$;
