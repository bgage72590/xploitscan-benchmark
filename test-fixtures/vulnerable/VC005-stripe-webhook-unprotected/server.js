// Stripe webhook handler without signature verification.
// Attackers can forge checkout.session.completed events.
// VC005 must fire.

import express from "express";
import Stripe from "stripe";

const app = express();

// Uses express.json() which consumes the body before verification.
// The handler trusts req.body without checking the signature header.
app.post("/api/webhooks/stripe", express.json(), async (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits, 10);

    // Anyone can POST a fake event and mint credits.
    await db.users.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    });
  }

  res.json({ received: true });
});

app.listen(3000);
