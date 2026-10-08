const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// PUT /api/products/:id (admin only)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, description },
    { new: true, runValidators: true },
  );
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE /api/products/:id (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
