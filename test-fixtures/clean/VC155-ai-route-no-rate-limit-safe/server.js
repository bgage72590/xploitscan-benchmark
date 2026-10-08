// Production server for the Gemini app: serves the built frontend and proxies
// generation requests so the API key never reaches the browser.
import express from "express";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.set("trust proxy", 1); // behind Cloud Run's load balancer
app.use(express.json());
app.use(express.static("dist"));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 30 generations per 10 minutes per client IP.
const generateLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 30 });

app.post("/api/generate", generateLimiter, async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({ text: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));
