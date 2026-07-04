// Feature flag admin endpoints. Two issues:
//   - VC003: PUT /flags has no auth, anyone can flip flags
//   - VC042: req.body spread straight into the flag record

const express = require("express");
const router = express.Router();

router.put("/flags/:key", async (req, res) => {
  await db.upsertFlag(req.params.key, { ...req.body });
  res.json({ ok: true });
});

router.delete("/flags/:key", async (req, res) => {
  await db.deleteFlag(req.params.key);
  res.status(204).end();
});

module.exports = router;
