// One-hop inter-procedural: a helper builds a log line by interpolating a
// raw request field, then the result is logged. VC044 should fire THROUGH
// the helper (the param flows raw into a template literal).
const express = require("express");
const router = express.Router();

function logLine(note) {
  return `[order] customer note: ${note}`;
}

router.post("/orders/note", express.json(), (req, res) => {
  console.log(logLine(req.body.note));
  res.json({ ok: true });
});

module.exports = router;
