// Bulk user import: the request body carries an array of records, each looped
// over and created directly — classic mass assignment, reached via for-of
// element taint (the loop variable inherits the tainted array's taint).
const express = require("express");
const router = express.Router();
const { User } = require("./model");

router.post("/admin/bulk-users", express.json(), async (req, res) => {
  const records = req.body.records;
  for (const rec of records) {
    await User.create(rec);
  }
  res.json({ created: records.length });
});

module.exports = router;
