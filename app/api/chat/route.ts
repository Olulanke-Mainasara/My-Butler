import { convertToModelMessages, isStepCount, streamText, UIMessage } from "ai";
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

Whenever you call a search tool, the app automatically renders the results
as clickable image cards right below your message - do not also list them
out or add markdown links for the same items, that would just duplicate
what's already shown. Just refer to items by name in your reply and give a
short, conversational reason for each recommendation; the cards are what
the user clicks through to view or buy.

Keep responses concise - a few recommendations with a short reason each
beats a long list.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      instructions: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: butlerTools,
      stopWhen: isStepCount(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
