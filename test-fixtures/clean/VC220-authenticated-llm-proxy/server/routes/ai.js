const express = require("express");
const OpenAI = require("openai");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function verifyToken(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.user = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

router.post("/generate", verifyToken, async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: req.body.prompt }],
  });
  res.json({ text: completion.choices[0].message.content });
});

router.post("/rewrite", [authenticate], async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Rewrite: ${req.body.text}` }],
  });
  res.json({ text: completion.choices[0].message.content });
});

module.exports = router;
