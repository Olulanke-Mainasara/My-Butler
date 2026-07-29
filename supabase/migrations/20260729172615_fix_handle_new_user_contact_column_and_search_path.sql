-- handle_new_user() inserted into brands.contact_no, a column that doesn't
-- exist (the column is `contact`), which made every brand signup throw and
-- roll back the whole auth.users insert. Fix the column name and pin
-- search_path for defense-in-depth (all refs are already schema-qualified).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    full_name TEXT;
    split_name TEXT[];
    user_role_id INT;
    brand_name TEXT;
    brand_description TEXT;
    brand_url TEXT;
BEGIN
    user_role_id := (NEW.raw_user_meta_data->>'role_id')::INT;

    IF user_role_id = 4 THEN
        brand_name := NEW.raw_user_meta_data->>'brand_name';
        brand_description := NEW.raw_user_meta_data->>'brand_description';
        brand_url := NEW.raw_user_meta_data->>'brand_url';

        IF brand_name IS NULL OR brand_name = '' THEN
            RAISE EXCEPTION 'Brand name is required for user ID: %', NEW.id;
        END IF;

        IF brand_description IS NULL OR brand_description = '' THEN
            RAISE EXCEPTION 'Brand description is required for user ID: %', NEW.id;
        END IF;

        IF brand_url IS NULL OR brand_url = '' THEN
            RAISE EXCEPTION 'Brand URL is required for user ID: %', NEW.id;
        END IF;

        INSERT INTO public.brands (
            id, name, description, url, email, contact, location, supabase_user_id
        ) VALUES (
            NEW.id,
            brand_name,
            brand_description,
            brand_url,
            NEW.email,
            NEW.phone,
            NEW.raw_user_meta_data->>'brand_location',
            NEW.id
        );
    ELSE
        full_name := NEW.raw_user_meta_data->>'full_name';

        IF full_name IS NULL OR full_name = '' THEN
            RAISE EXCEPTION 'Full name is missing or empty for user ID: %', NEW.id;
        END IF;

        split_name := string_to_array(full_name, ' ');

        IF array_length(split_name, 1) IS NULL OR array_length(split_name, 1) = 0 THEN
            RAISE EXCEPTION 'Full name could not be split for user ID: %', NEW.id;
        END IF;

        INSERT INTO public.customers (
            id, email, display_name, first_name, last_name, profile_picture, phone_no, supabase_user_id
        ) VALUES (
            NEW.id,
            NEW.email,
            full_name,
            split_name[1],
            COALESCE(array_to_string(split_name[2:], ' '), ''),
            NEW.raw_user_meta_data->>'picture',
            NEW.phone,
            NEW.id
        );
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error in handle_new_user trigger for user ID %: %', NEW.id, SQLERRM;
END;
$function$;

CREATE OR REPLACE FUNCTION public.customers_insert_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, created_at)
  VALUES (NEW.id, 'welcome', 'Welcome to our community', 'Hi! Welcome to our platform — we are excited to have you. You can visit your profile to get started there.', now());
  RETURN NEW;
END;$function$;
