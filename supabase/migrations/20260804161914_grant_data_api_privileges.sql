-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

GRANT DELETE, INSERT, SELECT, UPDATE ON public.admins TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.admins TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.admins TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.bookmarks TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.bookmarks TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.bookmarks TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.brands TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.brands TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.brands TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.camera_pictures TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.camera_pictures TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.camera_pictures TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.cart TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.cart TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.cart TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.categories TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.categories TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.categories TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.chats TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.chats TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.chats TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.collections TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.collections TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.collections TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.customers TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.customers TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.customers TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.events TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.events TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.events TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.news TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.news TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.news TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.notifications TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.notifications TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.notifications TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.order_items TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.order_items TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.order_items TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.orders TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.orders TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.orders TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.products TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.products TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.products TO service_role;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.reviews TO anon;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.reviews TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.reviews TO service_role;

GRANT USAGE ON SEQUENCE public.categories_id_seq TO anon, authenticated;

GRANT USAGE ON SEQUENCE public.reviews_id_seq TO anon, authenticated;
