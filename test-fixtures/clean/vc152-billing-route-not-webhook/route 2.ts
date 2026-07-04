// Authenticated Stripe checkout route. Imports from @clerk/nextjs/server
// for the auth check, then creates a Stripe Checkout Session and returns
// session.url. NOT a webhook — and the old VC152 was flagging it because
// of the `/api/` path + Clerk import + "session." match.
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await currentUser();
  const session = await stripe.checkout.sessions.create({
    customer_email: user!.emailAddresses[0].emailAddress,
    line_items: [{ price: "price_xyz", quantity: 1 }],
    mode: "subscription",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
  });

  return Response.json({ url: session.url });
}
