const express = require("express");
const router = express.Router();
const { requireAuth } = require("./middleware/auth");

// Router-level middleware genuinely protects every handler below it, so
// whole-file suppression is correct here and must be preserved.
router.use(requireAuth);

router.get("/notes", async (req, res) => {
  res.json(await db.note.findMany());
});

router.delete("/notes/:id", async (req, res) => {
  await db.note.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

module.exports = router;
