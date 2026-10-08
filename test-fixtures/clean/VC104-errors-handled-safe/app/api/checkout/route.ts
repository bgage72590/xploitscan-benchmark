import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import { logger } from "@/lib/logger";

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
  } catch (err) {
    logger.error({ err, orderId: order.id }, "failed to attach payment intent to order");
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }

  try {
    await sendOrderConfirmation(session.user.email!, order);
  } catch (err) {
    // The payment can still go through; the confirmation is retried by the email worker.
    logger.warn({ err, orderId: order.id }, "order confirmation email failed");
  }

  return NextResponse.json({ clientSecret: intent.client_secret });
}
