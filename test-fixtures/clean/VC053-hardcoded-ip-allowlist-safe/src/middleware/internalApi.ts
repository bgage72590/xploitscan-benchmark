import type { NextFunction, Request, Response } from "express";

// Internal endpoints check the caller against an address allowlist AND a
// shared token, both taken from the environment at deploy time.
const internalIpAllowlist = new Set((process.env.INTERNAL_IP_ALLOWLIST ?? "").split(",").filter(Boolean));

export function internalOnly(req: Request, res: Response, next: NextFunction) {
  const ip = (req.ip ?? "").replace(/^::ffff:/, "");
  const token = req.get("x-internal-token");
  if (!internalIpAllowlist.has(ip) || !token || token !== process.env.INTERNAL_API_TOKEN) {
    return res.status(404).end();
  }
  next();
}
