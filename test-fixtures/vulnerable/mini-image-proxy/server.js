// Image proxy that fetches an arbitrary URL the client supplies. SSRF
// surface: attacker can probe internal network, cloud metadata, etc.
// VC041 must fire (AST taint should pick this up across the variable
// binding).

const express = require("express");
const router = express.Router();

router.get("/proxy/image", async (req, res) => {
  const target = req.query.src;
  const upstream = await fetch(target);
  const buf = await upstream.arrayBuffer();
  res.type(upstream.headers.get("content-type") || "image/jpeg").send(Buffer.from(buf));
});

module.exports = router;
