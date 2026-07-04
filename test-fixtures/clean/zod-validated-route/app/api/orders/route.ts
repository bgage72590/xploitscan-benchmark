// Next.js App Router POST endpoint with zod-validated body, auth check,
// and parameterized DB write via Prisma. This is the "textbook correct"
// shape — nothing should fire on it. VC006, VC003, VC154 must all stay
// quiet.

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const CreateOrder = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
  shippingAddress: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const user = await requireUser(req);

  const json = await req.json();
  const parsed = CreateOrder.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Prisma's create() uses parameterized queries — no injection possible.
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      shippingAddress: parsed.data.shippingAddress,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
