import { tool } from "ai";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

// Tools the Butler can call to ground its answers in real catalog data
// instead of guessing. Each returns a small, bounded result set - the model
// should summarize/recommend from these, not dump them verbatim.

export const searchProducts = tool({
  description:
    "Search the product catalog by name and optional price range. Use this whenever the user asks for product recommendations, wants to buy something, or asks what's available.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Keyword to match against the product name"),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    limit: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ query, minPrice, maxPrice, limit }) => {
    let request = supabase
      .from("products")
      .select("id, slug, name, description, price, stock_quantity, product_images")
      .limit(limit);

    if (query) request = request.ilike("name", `%${query}%`);
    if (minPrice !== undefined) request = request.gte("price", minPrice);
    if (maxPrice !== undefined) request = request.lte("price", maxPrice);

    const { data, error } = await request;
    if (error) return { error: error.message };
    return { products: data };
  },
});

export const searchCollections = tool({
  description:
    "Search curated collections by name. Use this when the user asks about a themed collection, a seasonal drop, or wants a curated set of products rather than a single item.",
  inputSchema: z.object({
    query: z.string().optional().describe("Keyword to match against the collection name"),
    limit: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ query, limit }) => {
    let request = supabase
      .from("collections")
      .select("id, slug, name, description, display_image")
      .limit(limit);

    if (query) request = request.ilike("name", `%${query}%`);

    const { data, error } = await request;
    if (error) return { error: error.message };
    return { collections: data };
  },
});

export const searchEvents = tool({
  description:
    "Search upcoming fashion events by name. Use this when the user asks about events, shows, or things happening soon. Only returns events that haven't started yet.",
  inputSchema: z.object({
    query: z.string().optional().describe("Keyword to match against the event title"),
    limit: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ query, limit }) => {
    let request = supabase
      .from("events")
      .select(
        "id, slug, title, description, start_date, location, is_virtual, admission_price, display_image"
      )
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(limit);

    if (query) request = request.ilike("title", `%${query}%`);

    const { data, error } = await request;
    if (error) return { error: error.message };
    return { events: data };
  },
});

export const searchBrands = tool({
  description:
    "Search brands by name. Use this when the user asks about a specific brand or wants to discover brands on the platform.",
  inputSchema: z.object({
    query: z.string().optional().describe("Keyword to match against the brand name"),
    limit: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ query, limit }) => {
    let request = supabase
      .from("brands")
      .select("id, name, description, location, profile_picture")
      .limit(limit);

    if (query) request = request.ilike("name", `%${query}%`);

    const { data, error } = await request;
    if (error) return { error: error.message };
    return { brands: data };
  },
});

export const butlerTools = {
  searchProducts,
  searchCollections,
  searchEvents,
  searchBrands,
};
