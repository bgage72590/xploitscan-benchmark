// Clean webhook: signature verified via Stripe SDK, sanitized log,
// idempotency check. VC005 + VC044 must NOT fire.

const express = require("express");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const router = express.Router();

function sanitize(s) {
  return String(s ?? "").replace(/[\r\n]/g, " ").slice(0, 80);
}

router.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json", limit: "1mb" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], WEBHOOK_SECRET);
    } catch {
      return res.status(400).json({ error: "invalid_signature" });
    }
    if (await db.eventAlreadyProcessed(event.id)) {
      return res.json({ deduped: true });
    }
    console.log(`stripe event id=${sanitize(event.id)} type=${sanitize(event.type)}`);
    await db.applyEvent(event);
    res.json({ ok: true });
  },
);

module.exports = router;
