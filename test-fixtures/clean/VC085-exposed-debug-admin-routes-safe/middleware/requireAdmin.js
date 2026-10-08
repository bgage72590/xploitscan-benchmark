const jwt = require("jsonwebtoken");

// Verifies the bearer token and requires the admin role, which is read from
// the signed token issued at login rather than from anything the client sends.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    if (claims.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    req.user = claims;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAdmin };
