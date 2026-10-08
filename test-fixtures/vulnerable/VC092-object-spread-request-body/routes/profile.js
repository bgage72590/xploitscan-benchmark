// Profile and notification-settings endpoints for the community app. Both
// copy the whole request body into the object that gets saved, so whatever
// keys the client sends ride along: role, emailVerified, credits, or
// __proto__ / constructor keys from a crafted JSON body. VC092 must fire.

const express = require("express");
const { requireUser } = require("../middleware/requireUser");
const { User, Settings } = require("../models");

const router = express.Router();

router.patch("/me", requireUser, async (req, res) => {
  const updates = { ...req.body, updatedAt: new Date() };
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
});

router.put("/me/settings", requireUser, async (req, res) => {
  const current = await Settings.findOne({ userId: req.user.id });
  const merged = Object.assign({}, req.body);
  merged.userId = req.user.id;
  await Settings.updateOne({ _id: current._id }, merged);
  res.json(merged);
});

module.exports = router;
