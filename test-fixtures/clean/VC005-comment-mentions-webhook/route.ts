// An authenticated user action that calls the Stripe API. It is NOT a webhook:
// nothing external posts to it, so there is no signature to verify.
//
// The comments below deliberately discuss the webhook that handles the same
// transition, and name a Stripe event type, because that is how a real
// codebase explains itself. Prose is not code. VC005 must not read this file
// as a webhook handler on the strength of a sentence.

import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await request.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  await stripe.subscriptions.update(await currentSubscriptionId(userId), {
    items: [{ price: priceFor(plan) }],
  });

  // Recorded after the change lands. By the time `customer.subscription.updated`
  // arrives, the webhook reads this row as prev_plan to decide what to clean
  // up, so writing it earlier would disarm that fallback.
  await recordPlan(userId, plan);

  return Response.json({ success: true, plan });
}

declare function currentSubscriptionId(userId: string): Promise<string>;
declare function priceFor(plan: string): string;
declare function recordPlan(userId: string, plan: string): Promise<void>;
