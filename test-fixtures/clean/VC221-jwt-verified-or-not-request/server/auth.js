const jwt = require("jsonwebtoken");

// Peek at the header to pick the key, then verify with it.
function requireUser(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const { header } = jwt.decode(token, { complete: true }) || {};
  const key = header && header.kid === "v2" ? process.env.JWT_KEY_V2 : process.env.JWT_KEY_V1;
  try {
    const payload = jwt.verify(token, key, { algorithms: ["HS256"] });
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { requireUser };
