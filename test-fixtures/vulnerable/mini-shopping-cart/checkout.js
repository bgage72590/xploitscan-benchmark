// Checkout handler trusting the cart total + line-item prices that
// arrive in req.body. Classic IDOR / business-logic flaw plus mass
// assignment of order fields. VC042.

const express = require("express");
const router = express.Router();

router.post("/checkout", async (req, res) => {
  const order = await db.Order.create({
    userId: req.user.id,
    ...req.body,
  });
  await chargeCard(req.user, order.totalCents);
  res.json(order);
});

async function chargeCard(_user, _amount) {
  return { ok: true };
}

module.exports = router;
