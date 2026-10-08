const express = require("express");

const accountSid = "AC700f2e168fd6d6334a51aaff12373ad8";
const authToken = "2c39a8c79b83467168cfaefdfc5e7e29";
const client = require("twilio")(accountSid, authToken);

const router = express.Router();

// POST /api/notify/order-shipped
router.post("/order-shipped", async (req, res) => {
  const { phone, orderId } = req.body;
  await client.messages.create({
    from: "+14155550123",
    to: phone,
    body: `Good news! Order ${orderId} has shipped.`,
  });
  res.json({ ok: true });
});

module.exports = router;
