import { toast } from "sonner";
import { supabase } from "./supabase/client";
import { CustomerProfile } from "@/types/CustomerProfile";

export const handleBookmark = async (
  customerProfile: CustomerProfile | null,
  item: { id: string } | undefined,
  target_type: string
) => {
  if (!customerProfile) {
    toast.info("You must be logged in to bookmark");
    return;
  }

  if (!item?.id) {
    toast.error("Invalid ID");
    return;
  }
  const { data, error } = await supabase.rpc("toggle_bookmark", {
    target_type: target_type,
    target_id: item.id,
  });

  if (error) {
    toast.error("Error modifying bookmarks");
  }

  if (data === "added") {
    toast.success("Bookmarked!");
  } else {
    toast("Removed from bookmarks");
  }
};

export async function fetchBrands({
  filters = {},
  countOnly = false,
}: {
  filters?: Record<string, string | number | boolean>;
  countOnly?: boolean;
} = {}) {
  let query = supabase
    .from("brands")
    .select("*", countOnly ? { count: "exact" } : {});

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, count, error } = await query;

  if (error) {
    toast.error("Failed to fetch brands.");
    return countOnly ? 0 : [];
  }

  return countOnly ? count ?? 0 : data ?? [];
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    toast.error("Failed to fetch categories.");
    return;
  }

  return data;
}

export async function fetchCollections({
  filters = {},
  countOnly = false,
}: {
  filters?: Record<string, string | number | boolean>;
  countOnly?: boolean;
} = {}) {
  let query = supabase
    .from("collections")
    .select("*", countOnly ? { count: "exact" } : {});

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, count, error } = await query;

  if (error) {
    toast.error("Failed to fetch collections.");
    return countOnly ? 0 : [];
  }

  return countOnly ? count ?? 0 : data ?? [];
}

export async function fetchProducts({
  filters = {},
  countOnly = false,
}: {
  filters?: Record<string, string | number | boolean>;
  countOnly?: boolean;
} = {}) {
  let query = supabase
    .from("products")
    .select("*", countOnly ? { head: true, count: "exact" } : {});

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, count, error } = await query;

  if (error) {
    toast.error("Failed to fetch products.");
    return countOnly ? 0 : [];
  }

  return countOnly ? count ?? 0 : data ?? [];
}

export async function fetchArticles({
  filters = {},
  countOnly = false,
}: {
  filters?: Record<string, string | number | boolean>;
  countOnly?: boolean;
} = {}) {
  let query = supabase
    .from("news")
    .select("*", countOnly ? { count: "exact" } : {});

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, count, error } = await query;

  if (error) {
    toast.error("Failed to fetch articles.");
    return countOnly ? 0 : [];
  }

  return countOnly ? count ?? 0 : data ?? [];
}

export async function fetchEvents({
  filters = {},
  countOnly = false,
}: {
  filters?: Record<string, string | number | boolean>;
  countOnly?: boolean;
} = {}) {
  let query = supabase
    .from("events")
    .select("*", countOnly ? { count: "exact" } : {});

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, count, error } = await query;

  if (error) {
    toast.error("Failed to fetch events.");
    return countOnly ? 0 : [];
  }

  return countOnly ? count ?? 0 : data ?? [];
}

export async function getBookmarkedItems(
  filteredBookmarkIds: string[],
  targetType: "products" | "collections" | "news" | "events"
) {
  const { data, error } = await supabase
    .from(targetType)
    .select("*")
    .in("id", filteredBookmarkIds);

  if (error) {
    toast.error("Error fetching bookmarks");
    return [];
  }

  return data || [];
}
