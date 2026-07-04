// Clean auth: secret from env, bcrypt verify, rate limit, session
// regenerate, RS256 JWT. None of VC031/VC047/VC046/VC079/VC060 should fire.

const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid" });
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "session_failed" });
    req.session.userId = user.id;
    const token = jwt.sign({ sub: user.id }, JWT_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });
    res.json({ token });
  });
});

module.exports = router;
