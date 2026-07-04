// JWT verification middleware. Same hardcoded secret leak as login.js,
// plus accepts the "none" algorithm — full forgery surface (VC079).

const jwt = require("jsonwebtoken");

const JWT_SECRET = "shh-dev-secret-ABC123";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "");
  try {
    req.user = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256", "none"],
    });
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

module.exports = { requireAuth };
