// Plural, and the next character after `webhooks` is still uppercase.
import express from "express";

const router = express.Router();

router.post("/deliveries", async (req, res) => {
  await store(req.body);
  res.json({ ok: true });
});

async function store(_: unknown) {}

export default router;
