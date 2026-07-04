// Login endpoint without any rate limiting or lockout. An attacker can
// brute force passwords at line rate. VC047 must fire.

const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(401).end();
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).end();
  res.json({ token: signToken(user) });
});

module.exports = router;
