import { NextResponse } from "next/server";

// Fills the model picker. Listing models runs no model and is not billed.
export async function GET() {
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    next: { revalidate: 3600 },
  });
  const { data } = await res.json();
  return NextResponse.json(data.map((m: { id: string }) => m.id));
}
