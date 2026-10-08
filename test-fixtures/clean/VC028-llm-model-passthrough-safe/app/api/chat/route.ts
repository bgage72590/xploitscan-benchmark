import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Models the product actually offers. Anything else from the client is rejected.
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"] as const;
type AllowedModel = (typeof ALLOWED_MODELS)[number];

function isAllowedModel(value: unknown): value is AllowedModel {
  return typeof value === "string" && (ALLOWED_MODELS as readonly string[]).includes(value);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, model, temperature } = await req.json();
  if (!isAllowedModel(model)) {
    return NextResponse.json({ error: "Unsupported model" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: typeof temperature === "number" ? Math.min(Math.max(temperature, 0), 1) : 0.7,
  });

  return NextResponse.json({ reply: completion.choices[0].message });
}
