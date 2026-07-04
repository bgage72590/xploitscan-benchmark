const express = require("express");
const router = express.Router();

// GET /documents/:id — WITH an ownership check: the query is scoped to the
// requesting user's id, so a user can only read their own documents.
// This is NOT an IDOR; VC158 must not fire.
router.get("/documents/:id", async (req, res) => {
  const doc = await db.document.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  res.json(doc);
});

module.exports = router;
