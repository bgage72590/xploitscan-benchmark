// Search route concatenating user input into raw SQL. Classic VC006.
// Multiple sinks (LIKE filter + ORDER BY) — both should fire.

const express = require("express");
const { db } = require("./db");
const router = express.Router();

router.get("/search", async (req, res) => {
  const { q, sort } = req.query;
  const rows = await db.query(
    `SELECT id, title FROM articles WHERE title LIKE '%${q}%' ORDER BY ${sort} LIMIT 50`,
  );
  res.json(rows);
});

module.exports = router;
