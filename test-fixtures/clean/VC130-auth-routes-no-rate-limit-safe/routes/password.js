const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

const router = express.Router();

// Every route in this router is a credential endpoint, so throttle them all.
router.use(
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false }),
);

const GENERIC = { message: "If an account exists for that email, a reset link has been sent." };
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = hashToken(token);
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      text: `Reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
    });
  }
  res.json(GENERIC);
});

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: hashToken(req.params.token),
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "This reset link is invalid or has expired" });
  }
  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: "Password has been reset" });
});

module.exports = router;
