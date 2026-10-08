const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Every route below requires a logged-in user.
router.use(protect);

// PATCH /api/account — update the caller's own profile
router.patch("/", async (req, res) => {
  const { name, bio } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, bio }, { new: true });
  res.json(user);
});

// DELETE /api/account — delete the caller's own account
router.delete("/", async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.clearCookie("token");
  res.status(204).end();
});

module.exports = router;
