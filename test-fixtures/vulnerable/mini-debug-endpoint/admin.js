// Debug endpoints reachable in production. VC033 (debug exposed) plus
// VC037 (stack trace returned).

const express = require("express");
const router = express.Router();

router.get("/debug/env", (_req, res) => {
  res.json({
    env: process.env,
    nodeVersion: process.version,
    pid: process.pid,
  });
});

router.get("/debug/throw", (_req, _res, next) => {
  try {
    throw new Error("induced");
  } catch (err) {
    next({ error: err.message, stack: err.stack });
  }
});

module.exports = router;
