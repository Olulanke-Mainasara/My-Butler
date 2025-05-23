import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

// Utility: Format AI text with HTML for display
export const formatResponseText = (text: string): string => {
  return text
    .replace(
      /--\s*(.*?)\s*--/g,
      '<h2 class="text-2xl font-bold text-white mt-4">$1</h2>'
    ) // Headers
    .replace(
      /###\s*(.*?)\s*\n/g,
      '<hr class="my-10"/><h3 class="text-lg font-semibold text-white">$1</h3>'
    ) // Subsections
    .replace(/-\s(.*?)\n/g, '<li class="text-base mb-2 pl-5">$1</li>') // Bullet points
    .replace(/\*\*(.*?)\*\*/g, '<strong class="mb-10">$1</strong>') // Bold text
    .replace(/\n\n/g, "<br/><br/>") // Paragraph spacing
    .trim();
};

// Message type definition
export type Message = {
  role: "user" | "assistant";
  content: string;
};

// Safely fetch AI response
export const getAssistantResponse = async (
  originalMessages: Message[],
  getTitle: boolean
): Promise<Message[] | null> => {
  const messages = [...originalMessages];

  if (getTitle) {
    const lastPromptContent = messages[messages.length - 1].content;
    const titlePrompt = `You are to respond to the following user prompt as an assistant. Your response must start with a **raw plain title** on the **first line only**. The title should be a concise summary relevant to developers. Do not style the title, do not prefix it with "Title:", do not wrap it in quotes, markdown, or symbols like **, ##, ###, etc.
      After the title, add a line with exactly 5 dashes (-----), then write your full assistant response below it. Before returning your response, verify that your output begins with an unstyled title, followed by exactly five dashes on a new line.
      Here is the user's prompt: "${lastPromptContent}"`;

    // Replace last message safely
    messages[messages.length - 1] = {
      ...messages[messages.length - 1],
      content: titlePrompt,
    };
  }

  const response = await fetch("/api/butler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
    cache: "no-cache",
  });

  if (!response.ok) return null;

  return await response.json();
};

export const cleanTitle = (rawTitle: string): string => {
  return rawTitle
    .replace(/^["'`*#>\s-]+/, "") // remove leading junk like quotes, backticks, stars, hashes, dashes
    .replace(/["'`*#<>\s-]+$/, "") // remove trailing junk
    .trim();
};
