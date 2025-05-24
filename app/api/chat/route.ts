import { streamText } from "ai";
import { myProvider } from "@/lib/ai/provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: myProvider.languageModel("chat-model"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
