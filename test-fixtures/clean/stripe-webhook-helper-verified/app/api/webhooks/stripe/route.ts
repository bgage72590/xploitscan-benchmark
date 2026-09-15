// The same route, verified — but with the verification extracted into a
// helper, which is what happens as soon as a project has more than one
// webhook. There is no constructEvent() call in this file, so a rule keyed
// only on that token would report it. The call names both the act and the
// subject (verifyStripeWebhook), which is the distinction that keeps a plain
// verifyUser() from suppressing a real finding.
import { verifyStripeWebhook } from "@/lib/stripe";

export async function POST(req: Request) {
  const event = await verifyStripeWebhook(req);

  if (event.type === "checkout.session.completed") {
    await grantAccess(event.data.object.customer);
  }

  return new Response("ok");
}

declare function grantAccess(id: string): Promise<void>;
