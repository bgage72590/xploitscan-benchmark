// Stripe webhook: verifies the signature, then grants entitlement — but never
// de-dupes on the event id, so a retried/replayed delivery double-grants.
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request, db: any) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type === "checkout.session.completed") {
    // Side effect with no replay guard.
    await db.subscription.create({ data: { userId: (event.data.object as any).client_reference_id, tier: "pro" } });
  }
  return new Response("ok");
}
