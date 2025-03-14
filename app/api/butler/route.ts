import getURL from "@/lib/getURL";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": `${getURL()}`, // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "My Butler", // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function POST(request: Request) {
  const body = await request.json();

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-lite-preview-02-05:free",
    messages: [
      {
        role: "system",
        content:
          "You are a fashion assistant knowledgeable about global trends, outfit care, events, and fashion brands. You are also an expert in social events and celebrations.",
      },
      ...body,
    ],
  });

  const message = completion.choices[0].message;

  return new Response(JSON.stringify([message]), {
    headers: { "Content-Type": "application/json" },
  });
}
