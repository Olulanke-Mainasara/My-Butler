-- cart, chats, customers, notifications had SELECT (and chats UPDATE)
-- policies with a bare `true` qual, meaning any authenticated user (and, for
-- notifications, any anonymous visitor) could read/write every other user's
-- row. Scope each to the owning user.

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.cart;
CREATE POLICY "Users can view their own cart" ON public.cart
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.chats;
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.chats;
CREATE POLICY "Users can update their own chats" ON public.chats
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
CREATE POLICY "Users can view their own customer profile" ON public.customers
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
