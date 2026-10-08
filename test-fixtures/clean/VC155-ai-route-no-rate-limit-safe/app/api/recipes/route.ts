import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from "@/auth";

const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

// 5 recipes per user per hour.
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, "1 h"),
  prefix: "ratelimit:recipes",
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { success } = await ratelimit.limit(session.user.id);
  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const { pantry } = await req.json();

  const { object } = await generateObject({
    model: google("gemini-2.5-pro"),
    schema: recipeSchema,
    prompt: `Create a dinner recipe using only: ${pantry}`,
  });

  return Response.json(object);
}
