import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  obj2: { [key: string]: string }
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
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
 * Set a value in local storage.
 *
 * Note: This function should only be called on the client side.
 * It will not work on the server side.
 *
 * @param key The key to store the value under.
 * @param value The value to store.
 * @returns The value that was stored.
 */
export function setLocalStorage(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  }
  return value;
}

/**
 * Get a value from local storage.
 *
 * Note: This function should only be called on the client side.
 * It will not work on the server side.
 *
 * @param key The key to retrieve the value from.
 * @returns The value stored under the given key,
 *          or null if the key does not exist.
 */
export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

/**
 * Sanitizes a given string by removing any occurrences of "<has_function_call>".
 *
 * This function is used to sanitize text that may contain function calls,
 * which could potentially be used to inject malicious code.
 *
 * @param text The string to sanitize.
 * @returns The sanitized string.
 */
export function sanitizeText(text: string) {
  return text.replace("<has_function_call>", "");
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
