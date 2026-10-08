// Express route that proxies chat requests to Groq. The key stays on the
// server and is read from the environment. VC163 must NOT fire.
import express from "express";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export const router = express.Router();

router.post("/api/chat", async (req, res) => {
  const { prompt } = req.body ?? {};
  if (typeof prompt !== "string" || prompt.length > 4000) {
    return res.status(400).json({ error: "Invalid prompt" });
  }
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });
  res.json({ reply: completion.choices[0]?.message?.content ?? "" });
});
