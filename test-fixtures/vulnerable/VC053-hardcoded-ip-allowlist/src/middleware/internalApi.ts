import type { NextFunction, Request, Response } from "express";

// Internal metrics/cron endpoints are "protected" by the caller's address.
const internalIpAllowlist = new Set(["10.20.0.15", "10.20.0.16"]);

export function internalOnly(req: Request, res: Response, next: NextFunction) {
  const ip = (req.ip ?? "").replace(/^::ffff:/, "");
  if (!internalIpAllowlist.has(ip)) {
    return res.status(404).end();
  }
  next();
}
