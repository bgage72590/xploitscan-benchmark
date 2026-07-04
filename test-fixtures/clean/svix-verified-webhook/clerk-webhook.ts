// Clerk webhook handler that verifies the signature with Svix (the library
// Clerk itself recommends — not Stripe's constructEvent). VC005 and VC152
// must both stay quiet: the signature IS verified, just with a different
// library than the scanner naively looks for.

import { Webhook } from "svix";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt;
  try {
    // This throws if the signature doesn't match. Equivalent to Stripe's
    // stripe.webhooks.constructEvent — just for Clerk/other Svix senders.
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // Handle event
  return NextResponse.json({ received: true, type: (evt as { type: string }).type });
}
