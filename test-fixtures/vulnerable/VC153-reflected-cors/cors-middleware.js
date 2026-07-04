// CORS middleware that reflects the request Origin with credentials enabled.
// Any website can make authenticated requests to this API.
// VC153 must fire.

export function corsMiddleware(req, res, next) {
  // Reflect whatever origin the caller sent — dangerous with credentials.
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
}
