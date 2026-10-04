const jwt = require("jsonwebtoken");

// Puts the caller's id on the request for every route behind it.
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  const decoded = jwt.decode(token);
  if (!decoded) return res.status(401).json({ error: "Bad token" });

  req.userId = decoded.sub;
  next();
};
