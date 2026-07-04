const express = require("express");
const app = express();

// POST /orders/lookup — fetches an order by a body-supplied id with no
// ownership check. Any user can read any order by sending its orderId.
app.post("/orders/lookup", async (req, res) => {
  const order = await prisma.order.findFirst({ where: { id: req.body.orderId } });
  res.json(order);
});
