// CORS middleware that uses an explicit allowlist before setting the
// Access-Control-Allow-Origin header. VC153 must NOT fire.

const ALLOWED_ORIGINS = new Set([
  "https://yourapp.com",
  "https://www.yourapp.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
}
