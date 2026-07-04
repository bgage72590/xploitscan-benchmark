// CORS restricted to a known frontend origin — the safe pattern.
// VC009 (wildcard CORS) must NOT fire here.
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://app.example.com",
    credentials: true,
  }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
