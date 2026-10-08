import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { prisma } from "./db.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api/notes", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const notes = await prisma.note.findMany({ where: { userId } });
  res.json(notes);
});

app.post("/api/notes", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const note = await prisma.note.create({ data: { userId, title: req.body.title, body: req.body.body } });
  res.status(201).json(note);
});

// updateMany/deleteMany scoped to the caller's userId: a note that belongs to
// someone else matches zero rows.
app.put("/api/notes/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const { count } = await prisma.note.updateMany({
    where: { id: req.params.id, userId },
    data: { title: req.body.title, body: req.body.body },
  });
  if (count === 0) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

app.delete("/api/notes/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const { count } = await prisma.note.deleteMany({ where: { id: req.params.id, userId } });
  if (count === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.listen(process.env.PORT || 3001);
