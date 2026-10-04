// Next.js App Router route using the OpenAI SDK with no session check.
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Summarize: ${text}` }],
  });
  return Response.json({ summary: completion.choices[0].message.content });
}
