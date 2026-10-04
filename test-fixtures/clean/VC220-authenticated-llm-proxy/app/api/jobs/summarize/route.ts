import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import OpenAI from "openai";

const openai = new OpenAI();

// Only QStash can call this: the wrapper verifies the upstash-signature header.
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const { text } = await req.json();
  const summary = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Summarize: ${text}` }],
    max_tokens: 300,
  });
  return Response.json({ summary: summary.choices[0].message.content });
});
