const express = require("express");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const router = express.Router();

// POST /api/notify/order-shipped
router.post("/order-shipped", async (req, res) => {
  const { phone, orderId } = req.body;
  await client.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to: phone,
    body: `Good news! Order ${orderId} has shipped.`,
  });
  res.json({ ok: true });
});

// POST /api/notify/sms-status: Twilio status callback, signature checked
// against the auth token before anything is trusted.
router.post("/sms-status", express.urlencoded({ extended: false }), (req, res) => {
  const signature = req.get("X-Twilio-Signature");
  const url = `${process.env.PUBLIC_URL}/api/notify/sms-status`;
  if (!twilio.validateRequest(authToken, signature, url, req.body)) {
    return res.sendStatus(403);
  }
  res.sendStatus(204);
});

module.exports = router;
