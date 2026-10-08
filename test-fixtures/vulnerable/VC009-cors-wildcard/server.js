import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS so the React frontend can talk to the API
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, plan: true },
  });
  res.json(user);
});

app.get("/api/invoices", requireAuth, async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(invoices);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
