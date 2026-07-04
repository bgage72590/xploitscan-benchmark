// Comment board route. Echoes user-supplied HTML into the response and
// logs the unsanitized text. VC007 (XSS) + VC044 (log injection).

const express = require("express");
const router = express.Router();

router.post("/comments", async (req, res) => {
  const { author, html } = req.body;
  console.log(`new comment by ${author}: ${html}`);
  await db.insertComment({ author, html });
  res.send(`<div class="comment">${html}</div>`);
});

module.exports = router;
