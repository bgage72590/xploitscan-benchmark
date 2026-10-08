// Order management for staff. verifyToken and verifyAdmin run before every
// route of this router, so the handlers below only see admins.
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { verifyToken, verifyAdmin } = require("../middleware/roles");

const prisma = new PrismaClient();
const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/admin/orders", async (req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json(orders);
});

router.get("/admin/orders/:id", async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

module.exports = router;
