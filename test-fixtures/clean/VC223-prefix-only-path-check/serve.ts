// Correct containment checks in every shape VC223 and the traversal rules
// must accept. None of these admits a sibling directory that shares the
// base's prefix, so VC223 must not fire — and VC117 / VC025 / VC093, which
// accept a correct containment check as the fix, must stay silent too.
import fs from "node:fs";
import path from "node:path";
import express, { type Request, type Response } from "express";

const router = express.Router();
const UPLOAD_DIR = path.resolve("/srv/uploads");
// Defined with the separator on the end, so a bare startsWith is correct.
const PUBLIC_ROOT = path.join(__dirname, "public") + path.sep;
const DOCS_ROOT = "/srv/docs/";

// 1. Separator appended at the comparison.
router.get("/uploads/:name", (req: Request, res: Response) => {
  const target = path.resolve(UPLOAD_DIR, req.params.name);
  if (!target.startsWith(UPLOAD_DIR + path.sep)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.sendFile(target);
});

// 2. Base constant defined with a trailing separator.
router.get("/public/:name", (req: Request, res: Response) => {
  const resolvedPath = path.resolve(PUBLIC_ROOT, req.params.name);
  if (!resolvedPath.startsWith(PUBLIC_ROOT)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.send(fs.readFileSync(resolvedPath));
});

// 3. path.relative, rejecting anything that climbs out.
router.get("/docs/:name", (req: Request, res: Response) => {
  const fullPath = path.resolve(DOCS_ROOT, req.params.name);
  const rel = path.relative(DOCS_ROOT, fullPath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.send(fs.readFileSync(fullPath));
});

// 4. The boundary character pinned in the same condition.
router.get("/raw/:name", (req: Request, res: Response) => {
  const filePath = path.resolve(UPLOAD_DIR, req.params.name);
  if (!(filePath.startsWith(UPLOAD_DIR) && filePath[UPLOAD_DIR.length] === path.sep)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.send(fs.readFileSync(filePath));
});

// 5. A template literal with the separator.
router.get("/media/:name", (req: Request, res: Response) => {
  const mediaDir = path.resolve("/srv/media");
  const target = path.resolve(mediaDir, req.params.name);
  if (!target.startsWith(`${mediaDir}/`)) {
    res.status(403).send("Forbidden");
    return;
  }
  res.sendFile(target);
});

// 6. Not a guard at all: a build-style classification of a path. Imprecise,
//    but nothing is accepted or rejected on the strength of it.
export function isFromSourceTree(file: string, srcDir: string): boolean {
  const absFile = path.resolve(file);
  const isFromSrc = absFile.startsWith(srcDir);
  return isFromSrc && !absFile.includes("node_modules");
}

export default router;
