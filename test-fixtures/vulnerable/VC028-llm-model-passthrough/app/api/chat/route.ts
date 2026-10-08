import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The model picker in the chat UI sends whichever model the user chose.
  const { messages, model, temperature } = await req.json();

  const completion = await openai.chat.completions.create({
    model: model || "gpt-4o-mini",
    messages,
    temperature: temperature ?? 0.7,
  });

  return NextResponse.json({ reply: completion.choices[0].message });
}
