import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { butlerTools } from "./tools";

const SYSTEM_PROMPT = `You are Butler, the AI shopping assistant for My Butler - a
fashion discovery and shopping platform where independent brands sell
products, run collections, and host events.

You have tools to search real products, collections, events, and brands on
the platform. Use them whenever the user asks for a recommendation, wants to
find something to buy or attend, or asks what's available - never invent
products, prices, or events. If a search comes back empty, say so plainly
instead of making something up.

When you recommend something, link to it in markdown using this exact
format so it renders as a clickable link in the app:
- Product: [Product Name](/shop/{slug}-{id})
- Collection: [Collection Name](/collections/{slug}-{id})
- Event: [Event Name](/events/{slug}-{id})
- Brand: [Brand Name](/brands/{id})

Keep responses concise and conversational - a few recommendations with a
short reason each beats a long list.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      tools: butlerTools,
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
