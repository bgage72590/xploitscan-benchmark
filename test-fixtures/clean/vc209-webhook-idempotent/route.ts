// Same Stripe webhook, but de-dupes on the event id before the side effect.
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request, db: any) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // Replay guard: ignore an event id we've already processed.
  const inserted = await db.processedEvents.create({ data: { id: event.id } }).catch(() => null);
  if (!inserted) return new Response("duplicate ignored");
  if (event.type === "checkout.session.completed") {
    await db.subscription.create({ data: { userId: (event.data.object as any).client_reference_id, tier: "pro" } });
  }
  return new Response("ok");
}
