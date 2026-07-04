// Next.js App Router list endpoint that returns every row in the table.
// VC156 must fire.

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await requireUser(req);

  // Returns every item. On a table with 100k rows this hammers the DB
  // and ships a huge payload to the client.
  const items = await db.item.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}
