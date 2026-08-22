import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";

/**
 * Invalidates every cached `useQuery` result for a given Supabase table
 * (matched the same way `hooks/use-user-info.tsx` invalidates
 * `notifications` on realtime events). Call this after a mutation so brand
 * dashboard writes show up immediately instead of waiting out the query's
 * staleTime.
 */
export function invalidateTable(queryClient: QueryClient, table: string) {
  return queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) && query.queryKey.includes(table),
  });
}

/**
 * Extracts the storage path from a Supabase Storage public URL, e.g.
 * "https://xyz.supabase.co/storage/v1/object/public/products/{brandId}/foo.jpg"
 * -> "{brandId}/foo.jpg" for bucket "products". Needed because
 * `storage.from(bucket).remove()` takes paths, not the public URLs saved on
 * the row - returns null if the URL doesn't match the expected shape (e.g.
 * a placeholder image) so callers can skip it rather than send a bad path.
 */
export function getStoragePathFromPublicUrl(
  url: string,
  bucket: string,
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

/**
 * Merges class names using `clsx` and `tailwind-merge`.
 *
 * This function takes multiple class name values, processes them using the
 * `clsx` utility to handle conditional and array-based class names, and
 * then merges them using `tailwind-merge` to ensure proper TailwindCSS
 * class precedence.
 *
 * @param inputs - A list of class values, which can be strings, arrays, or
 *                 conditional objects, to be merged into a single class name
 *                 string.
 * @returns A single string containing the merged class names.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Base64-encoded string into a File object.
 *
 * The function extracts the MIME type from the data URL and decodes the Base64
 * string into a binary Uint8Array. It then creates a File object using the
 * decoded data, the given filename, and the extracted MIME type.
 *
 * @param base64String The Base64-encoded string representing the file data.
 * @param filename The name to be given to the resulting File object.
 *
 * @returns A File object constructed from the Base64-encoded data.
 */

export function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"; // Extract MIME type
  const bstr = atob(arr[1]); // Decode Base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * Compares two objects to determine if they are equal.
 *
 * The objects must have the same key-value pairs, and the values must be strings.
 *
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 *
 * @returns true if the objects are equal, false otherwise.
 */
export function compareTwoObjects(
  obj1: { [key: string]: string },
  obj2: { [key: string]: string },
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
  );
}

/**
 * Gets the URL of the site.
 *
 * Tries to use the `NEXT_PUBLIC_SITE_URL` environment variable, then falls
 * back to `NEXT_PUBLIC_VERCEL_URL` if available, and finally uses
 * `http://localhost:3000/` if neither is set.
 *
 * Ensures that the URL has a scheme (`https://`) and a trailing `/`.
 *
 * @returns The URL of the site.
 */
export function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}

/**
 * Converts a string into a slug, suitable for use in a URL.
 *
 * @remarks
 * Replaces all non-word characters with a space, replaces multiple
 * spaces with a single hyphen, and trims any extra hyphens from the
 * beginning and end of the string.
 *
 * @example
 * generateSlug("Hello World!") // => "hello-world"
 *
 * @param name - The string to convert to a slug.
 * @returns The slugified string.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

/**
 * Generates a UUID (Universally Unique Identifier) string in the format of xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 *
 * This function uses the random number generator to generate random numbers, which are then converted to hexadecimal strings.
 * The resulting string is a valid UUID.
 *
 * @returns A string representing a UUID.
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Normalizes and formats a phone number to a standardized international format.
 *
 * This function processes the input string to ensure it conforms to an international phone number format,
 * specifically handling Nigerian local numbers by converting them to their international equivalent.
 * It removes non-digit characters (except for the leading plus sign), converts local Nigerian numbers
 * to international format, and formats the number into segments.
 *
 * @param input - The phone number string to be normalized and formatted.
 * @returns The phone number formatted as +[countryCode]-[first]-[middle]-[last],
 *          or the original input if it cannot be properly formatted.
 */

export function normalizeAndFormatPhoneNumber(input: string | null) {
  if (!input) return input;

  let cleaned = input.replace(/[^\d+]/g, "");

  // Convert local Nigerian numbers (e.g. 0818...) to international
  if (/^0\d{10}$/.test(cleaned)) {
    cleaned = "+234" + cleaned.slice(1);
  }

  // Convert leading "234" (without plus) to "+234"
  if (/^234\d{10}$/.test(cleaned)) {
    cleaned = "+" + cleaned;
  }

  // Match +2348182445786
  const match = cleaned.match(/^\+?(\d{1,4})(\d{3})(\d{3})(\d{4})$/);

  if (!match) return input; // fallback

  const [, countryCode, first, middle, last] = match;

  return `+${countryCode}-${first}-${middle}-${last}`;
}

/**
 * Converts a raw date string to a readable date string.
 *
 * The function takes a raw date string (in the format of "YYYY-MM-DDTHH:MM:SS.SSSZ") and
 * returns a string in the format of "Month DD, YYYY".
 *
 * @param rawDate - The raw date string to be converted.
 * @returns A string in the format of "Month DD, YYYY".
 */
export function convertRawDateToReadableDate(rawDate: string) {
  const date = new Date(rawDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Converts a raw date string to a readable time string.
 *
 * The function takes a raw date string (in the format of "YYYY-MM-DDTHH:MM:SS.SSSZ") and
 * returns a string in the format of "HH:MM AM/PM".
 *
 * @param rawDate - The raw date string to be converted.
 * @returns A string in the format of "HH:MM AM/PM".
 */
export function convertRawDateToReadableTime(rawDate: string) {
  const date = new Date(rawDate);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
}

// utils.ts

/**
 * Regex for validating UUID v1–v5 formats
 */
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Build a slug-id string from a slug and UUID
 * Example: buildProductSlugId("apple-juice-1l", "123e4567-e89b-12d3-a456-426614174000")
 * -> "apple-juice-1l-123e4567-e89b-12d3-a456-426614174000"
 */
export function buildItemSlugId(slug: string, id: string): string {
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid UUID format");
  }
  return `${slug}-${id}`;
}

/**
 * Extracts the product UUID from a slug-id string.
 * Returns null if the UUID is invalid.
 */
export function getItemId(slugAndId: string): string | null {
  const id = slugAndId.slice(-36);
  return uuidRegex.test(id) ? id : null;
}

export function convertRawPriceToReadablePrice(rawPrice: number): string {
  return rawPrice.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}
