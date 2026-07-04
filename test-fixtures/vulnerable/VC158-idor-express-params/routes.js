const express = require("express");
const router = express.Router();

// GET /documents/:id — returns a document by id with NO ownership check.
// Any user can read any other user's document by changing the id in the URL.
// Classic IDOR / BOLA — the failure mode AI tools ship on generated routes.
router.get("/documents/:id", async (req, res) => {
  const doc = await db.document.findUnique({ where: { id: req.params.id } });
  res.json(doc);
});

module.exports = router;
