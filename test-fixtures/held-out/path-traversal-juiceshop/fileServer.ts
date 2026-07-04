// Adapted from juice-shop/juice-shop routes/fileServer.ts (MIT). See NOTICE.
import path from "node:path";
import { type Request, type Response, type NextFunction } from "express";
import * as utils from "../lib/utils";

const cutOffPoisonNullByte = (str: string) => {
  const nullByte = "%00";
  if (str.includes(nullByte)) {
    return str.substring(0, str.indexOf(nullByte));
  }
  return str;
};

export function servePublicFiles() {
  return ({ params }: Request, res: Response, next: NextFunction) => {
    const file = params.file;

    if (!file.includes("/")) {
      verify(file, res, next);
    } else {
      res.status(403);
      next(new Error("File names cannot contain forward slashes!"));
    }
  };

  function verify(file: string, res: Response, next: NextFunction) {
    if (file && (endsWithAllowlistedFileType(file) || file === "incident-support.kdbx")) {
      file = cutOffPoisonNullByte(file);
      res.sendFile(path.resolve("ftp/", file));
    } else {
      res.status(403);
      next(new Error("Only .md and .pdf files are allowed!"));
    }
  }

  function endsWithAllowlistedFileType(param: string) {
    return utils.endsWith(param, ".md") || utils.endsWith(param, ".pdf");
  }
}
