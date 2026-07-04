// Admin dashboard mini-app. Mounts admin routes WITHOUT any auth check
// (VC003) and exposes stack traces in the error response (VC037).

const express = require("express");
const router = express.Router();

router.get("/admin/users", async (req, res) => {
  try {
    const users = await db.allUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.delete("/admin/users/:id", async (req, res) => {
  await db.deleteUser(req.params.id);
  res.status(204).end();
});

module.exports = router;
