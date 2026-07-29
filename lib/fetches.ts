import { supabase } from "./supabase/client";
import { Database } from "@/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

// Customer Profile
export const getCustomerProfile = (userId: string) => {
  return supabase
    .from("customers")
    .select(
      "id, first_name, last_name, display_name, email, location, phone_no, profile_picture, supabase_user_id, created_at, updated_at"
    )
    .eq("id", userId)
    .single();
};

// Brand Profile
export const getBrandProfile = (userId: string) => {
  return supabase
    .from("brands")
    .select(
      "id, name, description, contact, email, location, profile_picture, supabase_user_id, url, created_at, updated_at"
    )
    .eq("id", userId)
    .single();
};

// Cart Items
export const getCartItems = (userId: string) => {
  return supabase
    .from("cart")
    .select("id, user_id, item_id, item_type, quantity, added_at, updated_at")
    .eq("user_id", userId);
};

// Notifications
export const getNotifications = (userId: string) => {
  return supabase
    .from("notifications")
    .select("id, user_id, title, message, type, is_read, created_at")
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
  targetType: "products" | "collections" | "news" | "events"
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

// Helper to apply filters
type QueryBuilder = ReturnType<SupabaseClient<Database>["from"]>["select"];

// Applies `.range()` only when a pageSize is passed, so existing callers of
// getProducts()/getCollections()/etc. with no arguments keep fetching the
// full table (unpaginated) exactly as before.
function paginate<T extends { range: (from: number, to: number) => T }>(
  query: T,
  { page = 0, pageSize }: PageParams
): T {
  if (!pageSize) return query;
  const from = page * pageSize;
  return query.range(from, from + pageSize - 1);
}

function applyFilters(
  query: QueryBuilder,
  filters: Record<string, string | number | boolean>
): QueryBuilder {
  let result = query;
  Object.entries(filters).forEach(([key, value]) => {
    result = result.eq(key, value);
  });
  return result;
}

// Brands
export const getBrands = (params: PageParams = {}) => {
  return paginate(supabase.from("brands").select("*"), params);
};

export const getBrandsCount = (
  filters: Record<string, string | number | boolean> = {}
) => {
  const query = supabase
    .from("brands")
    .select("*", { count: "exact", head: true });
  return applyFilters(query, filters);
};

export const getBrand = (brandId: string) => {
  return supabase.from("brands").select("*").eq("id", brandId).single();
};

// Categories
export const getCategories = () => {
  return supabase.from("categories").select("*");
};

export const getCategoriesCount = (
  filters: Record<string, string | number | boolean> = {}
) => {
  const query = supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  return applyFilters(query, filters);
};

export const getCategory = (categoryId: number) => {
  return supabase.from("categories").select("*").eq("id", categoryId).single();
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
  return paginate(supabase.from("events").select("*"), params);
};

export const getEventsCount = () => {
  return supabase
    .from("events")
    .select("*", { count: "estimated", head: true });
};

export const getEvent = (eventId: string) => {
  return supabase.from("events").select("*").eq("id", eventId).single();
};
