import path from "node:path";
import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/home", (_req: Request, res: Response) => {
  // Fully static path rooted at __dirname — no user input reaches sendFile.
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.get("/download/:name", (req: Request, res: Response) => {
  // User input, but with a real containment check before serving.
  const base = path.resolve("downloads");
  const target = path.resolve(base, req.params.name);
  if (!target.startsWith(base + path.sep)) {
    res.status(400).send("Invalid path");
    return;
  }
  res.sendFile(target);
});

export default router;
