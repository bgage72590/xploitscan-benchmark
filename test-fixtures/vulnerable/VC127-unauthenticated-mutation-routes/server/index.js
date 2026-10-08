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

app.put("/api/notes/:id", async (req, res) => {
  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: { title: req.body.title, body: req.body.body },
  });
  res.json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  await prisma.note.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.listen(process.env.PORT || 3001);
