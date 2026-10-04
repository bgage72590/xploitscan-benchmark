// Express backend: the chat route hands off to a helper that calls OpenAI.
// The health route makes no AI call and is not reported.
const express = require("express");

const app = express();
app.use(express.json());

async function askModel(messages) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages }),
  });
  return r.json();
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/chat", async (req, res) => {
  res.json(await askModel(req.body.messages));
});

app.listen(3001);
