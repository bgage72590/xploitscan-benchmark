// The helper interpolates only its FIRST parameter; the tainted value is
// passed as the second (uninterpolated) argument. Per-index precision: the
// one-hop pass must not propagate it, so VC044 must not fire.
const express = require("express");
const router = express.Router();

function labeled(kind, value) {
  return `[${kind}] event`;
}

router.post("/orders/audit", express.json(), (req, res) => {
  console.log(labeled("audit", req.body.note));
  res.json({ ok: true });
});

module.exports = router;
