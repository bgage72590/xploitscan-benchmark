import path from "node:path";
import express, { type Request, type Response } from "express";

// A download route whose only guard is a prefix-only startsWith. With
// FILES_ROOT = /srv/files, "../files-backup/db.sqlite" resolves to
// /srv/files-backup/db.sqlite and passes the check. VC093 used to accept
// any startsWith as a containment check and stayed silent.

const router = express.Router();
const FILES_ROOT = path.resolve("/srv/files");

router.get("/files/:name", (req: Request, res: Response) => {
  const resolvedPath = path.resolve(FILES_ROOT, req.params.name);
  if (!resolvedPath.startsWith(FILES_ROOT)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.sendFile(resolvedPath);
});

export default router;
