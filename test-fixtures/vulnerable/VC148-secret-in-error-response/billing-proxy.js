// Express route that proxies a charge to the payment provider. The catch block
// echoes the upstream request context back to the caller "to help debugging",
// which hands the provider API key to anyone who can make the call fail.
// Triggers VC148 (Secret Leaked in Error Response).

const express = require("express");
const router = express.Router();

router.post("/charge", async (req, res) => {
  try {
    const upstream = await fetch("https://api.example-payments.com/v1/charges", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PAYMENTS_API_KEY}` },
      body: JSON.stringify({ amount: req.body.amount, currency: "usd" }),
    });

    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    return res.json(await upstream.json());
  } catch (err) {
    req.log.error({ err }, "charge failed");
    return res.status(502).json({ error: "Charge failed", detail: err.message, apiKey: process.env.PAYMENTS_API_KEY, endpoint: "https://api.example-payments.com/v1/charges" });
  }
});

module.exports = router;
