// Profile and notification-settings endpoints for the community app. Each
// handler destructures the fields a user may change and builds the saved
// object from those alone, so role, emailVerified, credits and any
// __proto__ / constructor keys in the body are never copied. VC092 must
// NOT fire.

const express = require("express");
const { requireUser } = require("../middleware/requireUser");
const { User, Settings } = require("../models");

const router = express.Router();

router.patch("/me", requireUser, async (req, res) => {
  const { displayName, bio, avatarUrl } = req.body;
  const updates = { displayName, bio, avatarUrl, updatedAt: new Date() };
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
});

router.put("/me/settings", requireUser, async (req, res) => {
  const current = await Settings.findOne({ userId: req.user.id });
  const { emailDigest, pushEnabled, timezone } = req.body;
  const next = {
    emailDigest: Boolean(emailDigest),
    pushEnabled: Boolean(pushEnabled),
    timezone: String(timezone ?? current.timezone),
    userId: req.user.id,
  };
  await Settings.updateOne({ _id: current._id }, next);
  res.json(next);
});

module.exports = router;
