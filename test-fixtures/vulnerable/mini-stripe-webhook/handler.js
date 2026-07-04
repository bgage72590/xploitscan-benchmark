// Stripe webhook handler with NO signature verification — anyone can
// POST a fake `checkout.session.completed` event and grant subscriptions.
// VC005 must fire.

const express = require("express");
const router = express.Router();

router.post("/webhooks/stripe", express.json(), async (req, res) => {
  const event = req.body;
  switch (event.type) {
    case "checkout.session.completed":
      await db.grantSubscription(event.data.object.customer);
      break;
    case "invoice.payment_failed":
      await db.flagOverdue(event.data.object.customer);
      break;
  }
  res.json({ received: true });
});

module.exports = router;
