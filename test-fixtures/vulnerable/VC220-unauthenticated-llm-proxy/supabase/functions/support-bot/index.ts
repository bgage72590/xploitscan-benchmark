// Rate limited, still unauthenticated: the limiter caps how fast a stranger
// can spend the owner's Anthropic budget, it does not stop them. Reported at
// medium rather than high.
import { checkRateLimit } from "../_shared/rate-limit.ts";

Deno.serve(async (req) => {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  await checkRateLimit(ip, 20);
  const { question } = await req.json();
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY")!;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 512, messages: [{ role: "user", content: question }] }),
  });
  return new Response(await res.text(), { headers: { "Content-Type": "application/json" } });
});
