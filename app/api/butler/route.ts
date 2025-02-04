import getURL from "@/lib/getURL";
import OpenAI from "openai";

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
    model: "deepseek/deepseek-r1-distill-qwen-32b",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You specialize in anything related to fashion. You are a fashion expert. You are also an expert in social events and celebrations.",
      },
      ...body,
    ],
  });

  const message = completion.choices[0].message;

  return new Response(JSON.stringify([message]), {
    headers: { "Content-Type": "application/json" },
  });
}
