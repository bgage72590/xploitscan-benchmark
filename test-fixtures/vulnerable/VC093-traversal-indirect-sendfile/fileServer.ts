import path from "node:path";
import { type Request, type Response, type NextFunction } from "express";

export function servePublicFiles() {
  return ({ params }: Request, res: Response, next: NextFunction) => {
    const file = params.file;
    verify(file, res, next);
  };

  function verify(file: string, res: Response, next: NextFunction) {
    if (file.endsWith(".md") || file.endsWith(".pdf")) {
      // path.resolve does NOT contain traversal: "../../etc/passwd" escapes.
      res.sendFile(path.resolve("ftp/", file));
    } else {
      next(new Error("Only .md and .pdf allowed"));
    }
  }
}
