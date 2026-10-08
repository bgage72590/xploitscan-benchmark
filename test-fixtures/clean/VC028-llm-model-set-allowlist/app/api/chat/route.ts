import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The models the chat UI offers. Anything else from the client is rejected.
const ALLOWED_MODELS = new Set(["gpt-4o-mini", "gpt-4o"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, model } = await req.json();
  if (!ALLOWED_MODELS.has(model)) {
    return NextResponse.json({ error: "Unsupported model" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model,
    messages,
  });

  return NextResponse.json({ reply: completion.choices[0].message, model: completion.model });
}
