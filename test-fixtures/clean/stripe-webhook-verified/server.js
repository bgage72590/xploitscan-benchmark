// Correctly verified Stripe webhook. VC005 must NOT fire.

import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const app = express();

app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await db.users.update({
        where: { id: session.metadata.userId },
        data: { credits: { increment: parseInt(session.metadata.credits, 10) } },
      });
    }

    res.json({ received: true });
  },
);

app.listen(3000);
