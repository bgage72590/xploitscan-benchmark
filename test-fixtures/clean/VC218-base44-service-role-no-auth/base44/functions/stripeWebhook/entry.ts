import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import Stripe from "npm:stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

// A webhook has no signed-in user, so Base44 tells receivers to use the
// service role. The caller is authenticated by Stripe's signature instead.
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const signature = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "");
  } catch {
    return new Response("bad signature", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    await base44.asServiceRole.entities.Order.update(event.data.object.metadata.order_id, { status: "paid" });
  }
  return Response.json({ received: true });
});
