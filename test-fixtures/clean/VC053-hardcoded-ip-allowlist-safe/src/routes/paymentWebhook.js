const express = require("express");
const Stripe = require("stripe");
const { markInvoicePaid } = require("../services/billing");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhooks are authenticated by their signature, not by a hand-copied list of
// the provider's IP addresses.
router.post("/webhooks/payments", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send("Invalid signature");
  }
  if (event.type === "invoice.paid") {
    await markInvoicePaid(event.data.object.id);
  }
  res.sendStatus(200);
});

module.exports = router;
