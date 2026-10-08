import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { describeImage } from "@/lib/gemini";

// 20 image descriptions per hour per IP.
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "ratelimit:describe",
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const { image, mimeType } = await req.json();
  const description = await describeImage(image, mimeType);
  return Response.json({ description });
}
