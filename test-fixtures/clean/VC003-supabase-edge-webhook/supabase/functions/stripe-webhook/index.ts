// A webhook receiver authenticates its caller with a signature, not a session.
// The function name carries the `webhook` segment with a hyphen rather than a
// slash, which is how edge functions are always named — one directory per
// function, no nesting.
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature") ?? "";
  const payload = await req.text();

  const event = await stripe.webhooks.constructEventAsync(
    payload,
    signature,
    Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET") ?? "",
  );

  return new Response(JSON.stringify({ received: event.type }), {
    headers: { "Content-Type": "application/json" },
  });
});
