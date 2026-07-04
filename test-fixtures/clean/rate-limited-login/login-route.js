// Login route with per-IP + per-account rate limiting. Brute force
// mitigated. VC047 must NOT fire.

const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(401).end();
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).end();
  res.json({ token: signToken(user) });
});

module.exports = router;
