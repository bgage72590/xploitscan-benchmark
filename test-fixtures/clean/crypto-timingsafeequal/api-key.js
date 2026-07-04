// Constant-time comparison using crypto.timingSafeEqual after a length
// check. No length- or prefix-leaking side channel. VC043 must NOT fire.

const crypto = require("node:crypto");

const EXPECTED_API_KEY = Buffer.from(process.env.INTERNAL_API_KEY ?? "", "utf8");

function authenticate(req, res, next) {
  const provided = Buffer.from(req.headers["x-api-key"] ?? "", "utf8");
  if (
    provided.length === EXPECTED_API_KEY.length &&
    crypto.timingSafeEqual(provided, EXPECTED_API_KEY)
  ) {
    return next();
  }
  return res.status(401).json({ error: "unauthorized" });
}

module.exports = { authenticate };
