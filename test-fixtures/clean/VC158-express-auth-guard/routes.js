const express = require("express");
const router = express.Router();
const { requireAuth } = require("./middleware/auth");

// This route is protected by requireAuth middleware. Consistent with VC158's
// precision-first design (skip when an auth signal is present rather than
// risk a false positive), the rule must not fire here.
router.get("/profile/:id", requireAuth, async (req, res) => {
  const profile = await db.profile.findUnique({ where: { id: req.params.id } });
  res.json(profile);
});

module.exports = router;
