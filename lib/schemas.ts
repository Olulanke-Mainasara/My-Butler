import * as z from "zod";

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .optional(),
  email: z.string().email().optional(),
  location: z
    .string()
    .min(2, {
      message: "Location must be at least 2 characters.",
    })
    .optional(),
});

export const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], "Please select a theme."),
});

export const brandProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(30, "Username must not be longer than 30 characters.")
    .optional(),
  email: z.email("Invalid email address.").optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters.")
    .optional(),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters.")
    .optional(),
  url: z.url({ message: "Invalid URL." }).optional(),
  contact: z
    .string()
    .regex(
      /^\+?[0-9]{7,15}$/,
      "Enter a valid phone number (7–15 digits, optional +)."
    )
    .optional(),
});

export const collectionFormSchema = z.object({
  name: z.string().min(2, "Collection name must be at least 2 characters."),
  description: z.string().optional(),
  category_id: z.number().min(1, "Please select a category."),
  display_image: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock_quantity: z.number().min(0, "Stock quantity must be non-negative"),
  category_id: z.number().min(1, "Please select a category"),
  collection_id: z.uuid().optional(),
  features: z.array(z.string(), "At least one feature is required."),
  specifications: z
    .record(z.string(), z.string().min(1, "Value is required"))
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "At least one specification is required."
    ),
  free_shipping: z.boolean().default(false),
  warranty_years: z.number().min(0).default(0),
  return_days: z.number().min(0).default(0),
});

export const articleSchema = z.object({
  author: z.string().min(1, "Author name is required"),
  author_bio: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  reading_time_minutes: z.number().min(1).default(5),
  title: z.string().min(1, "Title is required"),
});

export const eventSchema = z.object({
  admission_price: z.number().min(0).default(0),
  capacity: z.number().min(1).default(100),
  description: z.string().optional(),
  duration_hours: z.number().min(1).default(8),
  end_date: z.string().optional(),
  exhibitor_count: z.number().min(0).default(0),
  featured_speakers_description: z.string().optional(),
  is_virtual: z.boolean().default(false),
  location: z.string().optional(),
  parking_available: z.boolean().default(false),
  registration_basis: z.string().default("First come, first served basis"),
  start_date: z.string().min(1, "Start date is required"),
  tickets_url: z.string().optional(),
  title: z.string().min(1, "Title is required"),
});
