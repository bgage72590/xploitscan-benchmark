const express = require("express");
const db = require("./db");

const app = express();

app.get("/api/users/:id", async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
  res.json(user);
});

app.get("/api/orders/:orderId", async (req, res) => {
  const order = await db.query("SELECT * FROM orders WHERE id = $1", [req.params.orderId]);
  res.json(order);
});
