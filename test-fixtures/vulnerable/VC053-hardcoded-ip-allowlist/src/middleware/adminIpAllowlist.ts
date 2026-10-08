import type { NextFunction, Request, Response } from "express";

// Only the office VPN egress and the on-call bastion may reach /admin. The
// addresses are compiled into the app: rotating the VPN's egress IP, or
// revoking one that leaked, means a code change and a redeploy, and every
// clone of the repo carries the list of addresses that unlock the admin panel.
const ADMIN_ALLOWED_IPS: string[] = ["203.0.113.10", "198.51.100.24", "192.0.2.77"];

export function adminIpAllowlist(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.ip ?? req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
  if (!ADMIN_ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
