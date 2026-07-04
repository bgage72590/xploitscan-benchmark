// Next.js API route that authenticates the user inside the function body
// and validates the request body with zod. This is the pattern that
// previously tripped VC003/VC065 false positives.
// VC003, VC065, and VC154 must NOT fire.

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserForApi } from "@/lib/auth";
import { getInboxItems, createInboxItem } from "@/lib/store";

export async function GET() {
  try {
    const user = requireUserForApi();
    const items = getInboxItems(user.id);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

const CreateItemSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const user = requireUserForApi();
  const parsed = CreateItemSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }
  const item = createInboxItem(user.id, parsed.data);
  return NextResponse.json({ item });
}
