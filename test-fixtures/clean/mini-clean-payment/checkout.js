// Clean payment flow: server-side amount calculation (never trusts the
// client total), Stripe key from env, idempotency key on the charge.
// VC042 + VC031 + VC005 must not fire.

const express = require("express");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/checkout", async (req, res) => {
  if (!req.user) return res.status(401).end();
  const cartItems = await db.cartItems(req.user.id);
  const totalCents = cartItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  const idempotencyKey = req.headers["idempotency-key"];
  if (!idempotencyKey) return res.status(400).json({ error: "missing_idempotency_key" });
  const intent = await stripe.paymentIntents.create(
    { amount: totalCents, currency: "usd", customer: req.user.stripeCustomerId },
    { idempotencyKey },
  );
  res.json({ clientSecret: intent.client_secret });
});

module.exports = router;
