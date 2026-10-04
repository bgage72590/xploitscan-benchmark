// Express: auth middleware passed by name in front of the AI route.
const express = require("express");
const { requireAuth } = require("./auth");

const app = express();

async function askModel(messages) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages }),
  });
  return r.json();
}

app.post("/api/chat", requireAuth, async (req, res) => {
  res.json(await askModel(req.body.messages));
});

app.listen(3001);
