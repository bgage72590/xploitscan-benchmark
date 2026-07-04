// The helper validates its input and returns it raw (bare `return v`) — a
// validator, not a builder. The one-hop pass must NOT treat a bare return as
// a passthrough, so VC044 must not fire.
const express = require("express");
const router = express.Router();

function asOrderId(v) {
  if (!/^[0-9]+$/.test(v)) throw new Error("bad id");
  return v;
}

router.post("/orders/log", express.json(), (req, res) => {
  console.log(`processing order ${asOrderId(req.body.id)}`);
  res.json({ ok: true });
});

module.exports = router;
