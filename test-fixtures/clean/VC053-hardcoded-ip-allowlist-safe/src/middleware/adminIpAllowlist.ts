import type { NextFunction, Request, Response } from "express";

// The admin allowlist is deployment configuration: ADMIN_ALLOWED_IPS is a
// comma-separated list set per environment, so it can be rotated without a
// code change and never lives in the repo. An empty list denies everyone.
const ADMIN_ALLOWED_IPS: string[] = (process.env.ADMIN_ALLOWED_IPS ?? "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

export function adminIpAllowlist(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.ip ?? req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
  if (!ADMIN_ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
