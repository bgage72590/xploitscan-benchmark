import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();
  const order = await db.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const intent = await stripe.paymentIntents.create({
    amount: order.totalCents,
    currency: "usd",
    metadata: { orderId: order.id },
  });

  try {
    await db.order.update({ where: { id: order.id }, data: { paymentIntentId: intent.id } });
    await sendOrderConfirmation(session.user.email!, order);
  } catch (err) {
  }

  return NextResponse.json({ clientSecret: intent.client_secret });
}
