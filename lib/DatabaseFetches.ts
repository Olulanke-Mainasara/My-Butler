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

export async function fetchCollections() {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    toast.error("Failed to fetch collections.");
    return;
  }

  return data;
}

export async function fetchBrands() {
  const { data, error } = await supabase.from("brands").select("*");

  if (error) {
    toast.error("Failed to fetch brands.");
    return;
  }

  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    toast.error("Failed to fetch categories.");
    return;
  }

  return data;
}

export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    toast.error("Failed to fetch products.");
    return [];
  }

  return data || [];
}

export async function fetchArticles() {
  const { data, error } = await supabase.from("news").select("*");

  if (error) {
    toast.error("Failed to fetch articles.");
    return [];
  }

  return data || [];
}

export async function fetchEvents() {
  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    toast.error("Failed to fetch events.");
    return [];
  }

  return data || [];
}
