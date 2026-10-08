const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/summarize  { text: string }
router.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string" || text.length === 0) {
    return res.status(400).json({ error: "text is required" });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: `Summarize this document:\n\n${text}` }],
  });

  res.json({ summary: message.content[0].text });
});

module.exports = router;
