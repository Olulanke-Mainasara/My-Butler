-- Every table's INSERT policy had WITH CHECK (true). The app itself relies
-- on column DEFAULTs (auth.uid()) rather than sending user_id/brand_id
-- explicitly, so it wasn't exploitable through the app UI, but a direct API
-- call could insert rows attributed to any user/brand. Scope each to the
-- owning column. categories and notifications have no legitimate direct-
-- insert path from the client (categories is admin-managed; notifications
-- are created by the customers_insert_notify trigger, which is SECURITY
-- DEFINER and bypasses RLS regardless) so those are dropped with no
-- replacement, denying client inserts entirely.

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.brands;
CREATE POLICY "Brands can insert their own row" ON public.brands
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.camera_pictures;
CREATE POLICY "Users can insert their own camera pictures" ON public.camera_pictures
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.cart;
CREATE POLICY "Users can insert into their own cart" ON public.cart
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.chats;
CREATE POLICY "Users can insert their own chats" ON public.chats
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.collections;
CREATE POLICY "Brands can insert their own collections" ON public.collections
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.customers;
CREATE POLICY "Users can insert their own customer row" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.events;
CREATE POLICY "Brands can insert their own events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.news;
CREATE POLICY "Brands can insert their own articles" ON public.news
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.notifications;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
CREATE POLICY "Brands can insert their own products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reviews;
CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
