import { NextResponse } from "next/server";
import { groupBy } from "lodash";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await db.invoice.findMany({ where: { ownerId: session.user.id } });
  const byMonth = groupBy(invoices, (inv) => inv.issuedAt.toISOString().slice(0, 7));
  return NextResponse.json(byMonth);
}
