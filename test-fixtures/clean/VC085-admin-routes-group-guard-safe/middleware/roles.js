const jwt = require("jsonwebtoken");

// Verifies the bearer token issued at login and puts its claims on req.user.
function verifyToken(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Requires the admin role from the signed token, never from the request body.
function verifyAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  return next();
}

module.exports = { verifyToken, verifyAdmin };
