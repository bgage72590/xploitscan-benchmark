// Next.js App Router Stripe webhook, written the way AI builders emit it.
// Note what is NOT here: the word "stripe" anywhere in the body. The route's
// identity is carried entirely by its directory, which is why a content-only
// rule could not see this file at all.
export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === "checkout.session.completed") {
    await grantAccess(event.data.object.customer);
  }
  if (event.type === "customer.subscription.deleted") {
    await revokeAccess(event.data.object.customer);
  }

  return new Response("ok");
}

declare function grantAccess(id: string): Promise<void>;
declare function revokeAccess(id: string): Promise<void>;
