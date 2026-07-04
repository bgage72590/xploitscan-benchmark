// Mini app: JWT login + middleware. Issues:
//   - Hardcoded JWT secret (VC031)
//   - Login endpoint without rate limiting (VC047)

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = "shh-dev-secret-ABC123";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  if (!user || !(await db.verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid" });
  }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

module.exports = router;
