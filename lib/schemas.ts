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
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
});

export const brandProfileFormSchema = z.object({
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

export const collectionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  display_image: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  description: z.string(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock_quantity: z.coerce.number().min(0, "Price must be at least 0"),
  category_id: z.coerce.number().min(0, "Price must be at least 0"),
  features: z.array(z.string(), {
    message: "At least one feature is required.",
  }),
  specifications: z
    .record(z.string().min(1, "Value is required"))
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "At least one specification is required.",
    }),
});

export const articleSchema = z.object({
  author: z.string().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters."),
  description: z.string().nullable(),
  title: z.string().min(3, "Title must be at least 3 characters."),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().nullable(),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().nullable(),
  location: z.string().nullable(),
  is_virtual: z.boolean().nullable(),
  tickets_url: z.string().url("Invalid URL").nullable(),
});
