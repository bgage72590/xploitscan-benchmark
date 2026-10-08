import { openai } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant for Acme's customers.",
    messages,
  });

  return result.toDataStreamResponse();
}
