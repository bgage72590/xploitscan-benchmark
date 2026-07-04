// Payment webhook with no signature check (VC005) AND logs the
// unsanitized customer email (VC044).

const express = require("express");
const router = express.Router();

router.post("/payments/webhook", express.json(), async (req, res) => {
  const event = req.body;
  console.log(`payment event ${event.type} for ${event.data.email}`);
  if (event.type === "succeeded") {
    await db.markPaid(event.data.invoice);
  }
  res.json({ ok: true });
});

module.exports = router;
