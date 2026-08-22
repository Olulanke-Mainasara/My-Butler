set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

drop policy "Enable users to view their own data only" on "public"."bookmarks";

drop policy "Enable users to view their own data only" on "public"."camera_pictures";

drop policy "Enable delete for users based on user_id" on "public"."chats";

drop trigger "customers_insert_notify" on "public"."customers";

alter table "public"."bookmarks"
  drop constraint "bookmarks_user_id_fkey";

alter table "public"."brands"
  drop constraint "brands_supabase_user_id_fkey";

alter table "public"."brands"
  drop constraint "brands_supabase_user_id_key";

alter table "public"."camera_pictures"
  drop constraint "camera_pictures_id_fkey";

alter table "public"."camera_pictures"
  drop constraint "camera_pictures_user_id_fkey";

alter table "public"."cart"
  drop constraint "cart_user_id_fkey";

alter table "public"."chats"
  drop constraint "chats_created_at_key";

alter table "public"."chats"
  drop constraint "chats_pkey";

alter table "public"."chats"
  drop constraint "chats_user_id_fkey";

alter table "public"."collections"
  drop constraint "collections_category_fkey";

alter table "public"."collections"
  drop constraint "collections_category_id_fkey";

alter table "public"."collections"
  drop constraint "collections_pkey";

alter table "public"."collections"
  drop constraint "lineups_brand_id_fkey";

alter table "public"."customers"
  drop constraint "customers_email_key";

alter table "public"."customers"
  drop constraint "customers_supabase_user_id_key";

alter table "public"."customers"
  drop constraint "users_supabase_user_id_fkey";

alter table "public"."events"
  drop constraint "events_brand_id_fkey";

alter table "public"."news"
  drop constraint "news_brand_id_fkey";

alter table "public"."notifications"
  drop constraint "notifications_user_id_fkey";

alter table "public"."orders"
  drop constraint "orders_customer_id_fkey";

alter table "public"."products"
  drop constraint "items_category_id_fkey";

alter table "public"."products"
  drop constraint "products_brand_id_fkey";

alter table "public"."products"
  drop constraint "products_rating_check";

alter table "public"."products"
  drop constraint "products_slug_key";

alter table "public"."reviews"
  drop constraint "reviews_user_id_fkey";

alter table "public"."customers"
  drop constraint "customers_pkey";

create extension "pgjwt" schema "extensions";

alter table "public"."categories"
  alter column "id" drop IDENTITY;

create sequence "public"."categories_id_seq" as integer increment by 1 minvalue 1 maxvalue 2147483647 START with 1 cache 1 no cycle;

alter sequence "public"."categories_id_seq" owned by "public"."categories"."id";

alter table "public"."notifications"
  add column "brand_id" uuid;

alter table "public"."brands"
  alter column "name" drop default;

alter table "public"."brands"
  alter column "name" type character varying(255) using "name"::character varying(255);

alter table "public"."customers"
  alter column "email" drop default;

alter table "public"."customers"
  alter column "email" type character varying(255) using "email"::character varying(255);

alter table "public"."customers"
  alter column "first_name" drop default;

alter table "public"."customers"
  alter column "first_name" type character varying(255) using "first_name"::character varying(255);

alter table "public"."customers"
  alter column "last_name" drop default;

alter table "public"."customers"
  alter column "last_name" type character varying(255) using "last_name"::character varying(255);

alter table "public"."events"
  alter column "admission_price" drop default;

alter table "public"."events"
  alter column "admission_price" type numeric(10,2) using "admission_price"::numeric(10,2);

alter table "public"."events"
  alter column "admission_price" set default 0;

alter table "public"."events"
  alter column "location" drop default;

alter table "public"."events"
  alter column "location" type character varying(255) using "location"::character varying(255);

alter table "public"."news"
  alter column "author" drop default;

alter table "public"."news"
  alter column "author" type character varying(255) using "author"::character varying(255);

alter table "public"."notifications"
  alter column "title" drop default;

alter table "public"."notifications"
  alter column "title" type character varying(255) using "title"::character varying(255);

alter table "public"."notifications"
  alter column "type" drop default;

alter table "public"."notifications"
  alter column "type" type character varying(50) using "type"::character varying(50);

alter table "public"."products"
  alter column "rating" drop default;

alter table "public"."products"
  alter column "rating" type numeric(3,2) using "rating"::numeric(3,2);

alter table "public"."products"
  alter column "rating" set default 0;

alter table "public"."reviews"
  alter column "rating" drop default;

alter table "public"."reviews"
  alter column "rating" type numeric(2,1) using "rating"::numeric(2,1);

alter table "public"."categories"
  alter column "id" set default nextval('public.categories_id_seq'::regclass);

alter table "public"."brands"
  add constraint "brands_id_key" unique (id);

alter table "public"."brands"
  add constraint "brands_supabase_auth_id_key" unique (supabase_user_id);

alter table "public"."brands"
  add constraint "brands_supabase_user_id_fkey" foreign key (supabase_user_id) references auth.users(id) on update cascade on delete cascade;

alter table "public"."camera_pictures"
  add constraint "camera_pictures_id_fkey" foreign key (id) references storage.objects(id) on update cascade on delete cascade;

alter table "public"."camera_pictures"
  add constraint "camera_pictures_id_key" unique (id);

alter table "public"."cart"
  add constraint "cart_id_key" unique (id);

alter table "public"."chats"
  add constraint "Chats_chat_id_key" unique (id);

alter table "public"."chats"
  add constraint "Chats_created_at_key" unique (created_at);

alter table "public"."chats"
  add constraint "Chats_pkey" primary key (id);

alter table "public"."collections"
  add constraint "collections_category_fkey" foreign key (category) references public.categories(name) on update cascade on delete cascade;

alter table "public"."collections"
  add constraint "collections_category_id_fkey" foreign key (category_id) references public.categories(id) on update cascade on delete cascade;

alter table "public"."collections"
  add constraint "lineups_brand_id_fkey" foreign key (brand_id) references public.brands(id) on update cascade on delete cascade;

alter table "public"."collections"
  add constraint "lineups_id_key" unique (id);

alter table "public"."collections"
  add constraint "lineups_pkey" primary key (id);

alter table "public"."customers"
  add constraint "users_email_key" unique (email);

alter table "public"."customers"
  add constraint "users_id_key" unique (id);

alter table "public"."bookmarks"
  add constraint "bookmarks_user_id_fkey" foreign key (user_id) references public.customers(id) on delete cascade;

alter table "public"."camera_pictures"
  add constraint "camera_pictures_user_id_fkey" foreign key (user_id) references public.customers(id) on update cascade on delete cascade;

alter table "public"."cart"
  add constraint "cart_user_id_fkey" foreign key (user_id) references public.customers(id) on delete cascade;

alter table "public"."chats"
  add constraint "chats_user_id_fkey" foreign key (user_id) references public.customers(id) on update cascade on delete cascade;

alter table "public"."customers"
  add constraint "users_pkey" primary key (id);

alter table "public"."customers"
  add constraint "users_supabase_user_id_fkey" foreign key (supabase_user_id) references auth.users(id) on update cascade on delete cascade;

alter table "public"."customers"
  add constraint "users_supabase_user_id_key" unique (supabase_user_id);

alter table "public"."events"
  add constraint "events_brand_id_fkey" foreign key (brand_id) references public.brands(id) on update cascade on delete cascade;

alter table "public"."events"
  add constraint "events_id_key" unique (id);

alter table "public"."news"
  add constraint "news_brand_id_fkey" foreign key (brand_id) references public.brands(id) on update cascade on delete cascade;

alter table "public"."news"
  add constraint "news_id_key" unique (id);

alter table "public"."notifications"
  add constraint "notifications_brand_id_fkey" foreign key (brand_id) references public.brands(id);

alter table "public"."notifications"
  add constraint "notifications_id_key" unique (id);

alter table "public"."notifications"
  add constraint "notifications_user_id_fkey" foreign key (user_id) references public.customers(id) on delete cascade;

alter table "public"."orders"
  add constraint "orders_customer_id_fkey" foreign key (customer_id) references public.customers(id);

alter table "public"."products"
  add constraint "items_category_id_fkey" foreign key (category_id) references public.categories(id) on delete cascade;

alter table "public"."products"
  add constraint "items_rating_check" check (((rating >= (0)::numeric) AND (rating <= (5)::numeric)));

alter table "public"."products"
  add constraint "items_slug_key" unique (slug);

alter table "public"."products"
  add constraint "products_brand_id_fkey" foreign key (brand_id) references public.brands(id) on update cascade on delete cascade;

alter table "public"."products"
  add constraint "products_id_key" unique (id);

alter table "public"."reviews"
  add constraint "reviews_id_key" unique (id);

alter table "public"."reviews"
  add constraint "reviews_user_id_fkey" foreign key (user_id) references public.customers(id) on update cascade on delete cascade;

create trigger customers_after_insert_notify
  after insert on public.customers
  for each row
  execute function public.customers_insert_notify();

create policy "Enable users to view their own data only" on "public"."bookmarks"
  for select
  to "authenticated"
  using ((( select auth.uid() as uid) = user_id));

create policy "Enable users to view their own data only" on "public"."camera_pictures"
  for select
  to "authenticated"
  using ((( select auth.uid() as uid) = user_id));

create policy "Enable delete for users based on user_id" on "public"."chats"
  for delete
  to PUBLIC
  using ((( select auth.uid() as uid) = user_id));

alter publication "supabase_realtime" add table "public"."bookmarks";

alter publication "supabase_realtime" add table "public"."brands";

alter publication "supabase_realtime" add table "public"."cart";

alter publication "supabase_realtime" add table "public"."chats";

alter publication "supabase_realtime" add table "public"."customers";

alter publication "supabase_realtime" add table "public"."notifications";

comment on column "public"."products"."free_shipping" is 'Whether product qualifies for free shipping';

comment on column "public"."products"."return_days" is 'Return policy duration in days';

comment on column "public"."products"."warranty_years" is 'Warranty duration in years';

comment on extension "pgjwt" is 'JSON Web Token API for Postgresql';

comment on table "public"."brands" is 'This table stores information about fashion brands, including their name, description, logo image, and website URL. Each brand can have multiple associated lineups, allowing the application to display the brand’s offerings.';

comment on table "public"."collections" is 'The collections table stores various collections offered by brands, such as seasonal collections. It includes details about each collection’s name, description, display image, and the brand it belongs to. The table helps organize and display brand-specific offerings on your platform.';

revoke all on function "public"."customers_insert_notify"() from "anon";

grant execute on function "public"."customers_insert_notify"() to "anon";

revoke all on function "public"."customers_insert_notify"() from "authenticated";

grant execute on function "public"."customers_insert_notify"() to "authenticated";

revoke all on function "public"."customers_insert_notify"() from "service_role";

grant execute on function "public"."customers_insert_notify"() to "service_role";

revoke all on function "public"."handle_new_user"() from "anon";

grant execute on function "public"."handle_new_user"() to "anon";

revoke all on function "public"."handle_new_user"() from "authenticated";

grant execute on function "public"."handle_new_user"() to "authenticated";

revoke all on function "public"."handle_new_user"() from "service_role";

grant execute on function "public"."handle_new_user"() to "service_role";

revoke all on function "public"."prevent_admin_signup_overlap"() from "anon";

grant execute on function "public"."prevent_admin_signup_overlap"() to "anon";

revoke all on function "public"."prevent_admin_signup_overlap"() from "authenticated";

grant execute on function "public"."prevent_admin_signup_overlap"() to "authenticated";

revoke all on function "public"."prevent_admin_signup_overlap"() from "service_role";

grant execute on function "public"."prevent_admin_signup_overlap"() to "service_role";

revoke all on function "public"."toggle_bookmark"(uuid, text) from "anon";

grant execute on function "public"."toggle_bookmark"(uuid, text) to "anon";

revoke all on function "public"."toggle_bookmark"(uuid, text) from "authenticated";

grant execute on function "public"."toggle_bookmark"(uuid, text) to "authenticated";

revoke all on function "public"."toggle_bookmark"(uuid, text) from "service_role";

grant execute on function "public"."toggle_bookmark"(uuid, text) to "service_role";

revoke all on function "public"."toggle_cart"(uuid, integer, text) from "anon";

grant execute on function "public"."toggle_cart"(uuid, integer, text) to "anon";

revoke all on function "public"."toggle_cart"(uuid, integer, text) from "authenticated";

grant execute on function "public"."toggle_cart"(uuid, integer, text) to "authenticated";

revoke all on function "public"."toggle_cart"(uuid, integer, text) from "service_role";

grant execute on function "public"."toggle_cart"(uuid, integer, text) to "service_role";

revoke all on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) from "anon";

grant execute on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) to "anon";

revoke all on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) from "authenticated";

grant execute on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) to "authenticated";

revoke all on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) from "service_role";

grant execute on function "public"."update_brand_details"(uuid, text, text, text, text, text, text, text) to "service_role";

revoke all on function "public"."update_brand_status"(uuid, text) from "anon";

grant execute on function "public"."update_brand_status"(uuid, text) to "anon";

revoke all on function "public"."update_brand_status"(uuid, text) from "authenticated";

grant execute on function "public"."update_brand_status"(uuid, text) to "authenticated";

revoke all on function "public"."update_brand_status"(uuid, text) from "service_role";

grant execute on function "public"."update_brand_status"(uuid, text) to "service_role";

revoke all on function "public"."update_customer_details"(uuid, text, text, text, text) from "anon";

grant execute on function "public"."update_customer_details"(uuid, text, text, text, text) to "anon";

revoke all on function "public"."update_customer_details"(uuid, text, text, text, text) from "authenticated";

grant execute on function "public"."update_customer_details"(uuid, text, text, text, text) to "authenticated";

revoke all on function "public"."update_customer_details"(uuid, text, text, text, text) from "service_role";

grant execute on function "public"."update_customer_details"(uuid, text, text, text, text) to "service_role";

revoke all on function "public"."update_product_rating_stats"() from "anon";

grant execute on function "public"."update_product_rating_stats"() to "anon";

revoke all on function "public"."update_product_rating_stats"() from "authenticated";

grant execute on function "public"."update_product_rating_stats"() to "authenticated";

revoke all on function "public"."update_product_rating_stats"() from "service_role";

grant execute on function "public"."update_product_rating_stats"() to "service_role";

grant select, update, usage on sequence "public"."categories_id_seq" to "anon", "authenticated", "postgres", "service_role";

revoke all on table "public"."payment_splits" from "anon";

grant delete, insert, references, select, trigger, truncate, update on table "public"."payment_splits" to "anon";

revoke all on table "public"."payment_splits" from "authenticated";

grant delete, insert, references, select, trigger, truncate, update on table "public"."payment_splits" to "authenticated";

revoke all on table "public"."payment_splits" from "service_role";

grant delete, insert, references, select, trigger, truncate, update on table "public"."payment_splits" to "service_role";

revoke all on table "public"."product_variants" from "anon";

grant delete, insert, references, select, trigger, truncate, update on table "public"."product_variants" to "anon";

revoke all on table "public"."product_variants" from "authenticated";

grant delete, insert, references, select, trigger, truncate, update on table "public"."product_variants" to "authenticated";

revoke all on table "public"."product_variants" from "service_role";

grant delete, insert, references, select, trigger, truncate, update on table "public"."product_variants" to "service_role";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "anon";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "authenticated";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "service_role";

alter default privileges for role "postgres" in schema "public" grant delete, insert, references, select, trigger, truncate, update on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant delete, insert, references, select, trigger, truncate, update on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant delete, insert, references, select, trigger, truncate, update on tables to "service_role";

alter table "public"."brands"
  alter column "supabase_user_id" set default auth.uid();

alter table "public"."customers"
  alter column "supabase_user_id" set default auth.uid();

