const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

const router = express.Router();

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetUrl}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({ resetPasswordToken: req.params.token });
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  await user.save();

  res.json({ message: "Password has been reset" });
});

module.exports = router;
