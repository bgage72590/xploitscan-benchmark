import { openai } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 10 requests per minute per IP, shared across all serverless instances.
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:chat",
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const { success, reset } = await ratelimit.limit(ip);
  if (!success) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
    });
  }

  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant for Acme's customers.",
    messages,
  });

  return result.toDataStreamResponse();
}
