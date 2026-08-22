import { supabase } from "./supabase/client";

// Customer Profile
export const getCustomerProfile = (userId: string) => {
  return supabase
    .from("customers")
    .select(
      "id, first_name, last_name, display_name, email, location, phone_no, profile_picture, supabase_user_id, created_at, updated_at",
    )
    .eq("id", userId)
    .single();
};

// Customers (admin)
export const getAllCustomers = (params: PageParams = {}) => {
  return paginate(supabase.from("customers").select("*"), params);
};

export const getCustomersCount = () => {
  return supabase
    .from("customers")
    .select("*", { count: "estimated", head: true });
};

// Brand Profile
export const getBrandProfile = (userId: string) => {
  return supabase
    .from("brands")
    .select(
      "id, name, description, contact, email, location, profile_picture, supabase_user_id, url, status, paystack_subaccount_code, payout_bank_code, payout_account_number, payout_account_name, payout_verified, commission_rate, created_at, updated_at",
    )
    .eq("id", userId)
    .single();
};

// Cart Items
export const getCartItems = (userId: string) => {
  return supabase
    .from("cart")
    .select(
      "id, user_id, item_id, item_type, quantity, added_at, updated_at, variant_id",
    )
    .eq("user_id", userId);
};

export const getProductsByIds = (productIds: string[]) => {
  return supabase.from("products").select("*").in("id", productIds);
};

// Notifications
export const getNotifications = (userId: string) => {
  return supabase
    .from("notifications")
    .select("id, user_id, title, message, type, is_read, created_at, brand_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

// Bookmarks
export const getBookmarks = (userId: string) => {
  return supabase
    .from("bookmarks")
    .select("id, user_id, target_id, target_type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

export const getBookmarkedItems = (
  bookmarkIds: string[],
  targetType: "products" | "collections" | "news" | "events",
) => {
  return supabase.from(targetType).select("*").in("id", bookmarkIds);
};

// Images
export const getImages = (userId: string) =>
  supabase.from("camera_pictures").select("*").eq("user_id", userId);

// Chats
export const getChats = (userId: string) => {
  return supabase.from("chats").select("id,title").eq("user_id", userId);
};

export const DEFAULT_PAGE_SIZE = 24;

export type PageParams = { page?: number; pageSize?: number };

// Applies `.range()` only when a pageSize is passed, so existing callers of
// getProducts()/getCollections()/etc. with no arguments keep fetching the
// full table (unpaginated) exactly as before.
function paginate<T extends { range: (from: number, to: number) => T }>(
  query: T,
  { page = 0, pageSize }: PageParams,
): T {
  if (!pageSize) return query;
  const from = page * pageSize;
  return query.range(from, from + pageSize - 1);
}

// Brands
export const getBrands = (params: PageParams = {}) => {
  return paginate(supabase.from("brands").select("*"), params);
};

export const getBrandsCount = () => {
  return supabase
    .from("brands")
    .select("*", { count: "estimated", head: true });
};

export const getBrand = (brandId: string) => {
  return supabase.from("brands").select("*").eq("id", brandId).single();
};

// Categories
export const getCategories = () => {
  return supabase.from("categories").select("*");
};

// Collections
export const getCollections = (params: PageParams = {}) => {
  return paginate(supabase.from("collections").select("*"), params);
};

export const getCollectionsCount = () => {
  return supabase
    .from("collections")
    .select("*", { count: "estimated", head: true });
};

export const getCollection = (collectionId: string) => {
  return supabase
    .from("collections")
    .select("*, category_id (name)")
    .eq("id", collectionId)
    .single();
};

// getCollection() embeds category_id as a joined { name } object for
// display, which isn't usable as the numeric value an edit form needs to
// prefill its category <select>. This returns the plain row instead.
export const getCollectionForEdit = (collectionId: string) => {
  return supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .single();
};

// Products
export const getProducts = (params: PageParams = {}) => {
  return paginate(supabase.from("products").select("*"), params);
};

export const getProductsCount = () => {
  return supabase
    .from("products")
    .select("*", { head: true, count: "estimated" });
};

export const getProduct = (productId: string) => {
  return supabase
    .from("products")
    .select("*, category_id (name)")
    .eq("id", productId)
    .single();
};

// See getCollectionForEdit — same problem, getProduct()'s embedded
// category_id isn't a number an edit form's <select> can use.
export const getProductForEdit = (productId: string) => {
  return supabase.from("products").select("*").eq("id", productId).single();
};

// Articles
export const getArticles = (params: PageParams = {}) => {
  return paginate(supabase.from("news").select("*"), params);
};

export const getArticlesCount = () => {
  return supabase.from("news").select("*", { count: "estimated", head: true });
};

export const getArticle = (articleId: string) => {
  return supabase.from("news").select("*").eq("id", articleId).single();
};

// Events
export const getEvents = (params: PageParams = {}) => {
  return paginate(
    supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true }),
    params,
  );
};

export const getEventsCount = () => {
  return supabase
    .from("events")
    .select("*", { count: "estimated", head: true });
};

export const getEvent = (eventId: string) => {
  return supabase.from("events").select("*").eq("id", eventId).single();
};

// Orders
export const getOrder = (orderId: string) => {
  return supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
};

// All orders (admin), with the buying customer's name/email attached.
export const getAllOrders = (params: PageParams = {}) => {
  return paginate(
    supabase
      .from("orders")
      .select("*, customers(display_name, email)")
      .order("created_at", { ascending: false }),
    params,
  );
};

export const getOrdersCount = () => {
  return supabase
    .from("orders")
    .select("*", { count: "estimated", head: true });
};

// Order line items belonging to a brand, across all customers' orders.
export const getBrandOrderItems = (brandId: string) => {
  return supabase
    .from("order_items")
    .select("*, orders(id, status, created_at)")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });
};

// Reviews
export const getProductReviews = (productId: string) => {
  return supabase
    .from("reviews")
    .select(
      "id, product_id, user_id, rating, review_text, reviewer_name, created_at",
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
};

export const getMyReviewForProduct = (productId: string, userId: string) => {
  return supabase
    .from("reviews")
    .select(
      "id, product_id, user_id, rating, review_text, reviewer_name, created_at",
    )
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();
};

// Admin
export const getIsAdmin = (userId: string) => {
  return supabase.from("admins").select("id").eq("id", userId).maybeSingle();
};

export const getPendingBrands = () => {
  return supabase
    .from("brands")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
};
