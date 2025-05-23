import { getURL } from "@/lib/utils";
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
    model: "deepseek/deepseek-prover-v2:free",
    reasoning_effort: "low",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant knowledgeable about global trends, global news, products, food, events, and fashion brands. You are also an expert in social events and celebrations.",
      },
      ...body,
    ],
  });

  // Check if the completion is empty
  if (!completion || !completion.choices || completion.choices.length === 0) {
    console.log("No response from the model");
    return new Response(
      JSON.stringify({ error: "No response from the model" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const message = completion.choices[0].message;

  return new Response(JSON.stringify([message]), {
    headers: { "Content-Type": "application/json" },
  });
}
