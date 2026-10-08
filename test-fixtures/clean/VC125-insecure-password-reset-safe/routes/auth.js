const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

const router = express.Router();

const RESET_TTL_MS = 30 * 60 * 1000; // 30 minutes
const GENERIC_RESPONSE = { message: "If an account exists for that email, a reset link has been sent." };

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Same response whether or not the account exists (no user enumeration)
    if (!user) {
      return res.json(GENERIC_RESPONSE);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = Date.now() + RESET_TTL_MS;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password (valid for 30 minutes): ${resetUrl}`,
    });

    res.json(GENERIC_RESPONSE);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password (single use, expiring token)
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
