// jwt.verify() with a pinned allowlist of strong asymmetric algorithms
// and no "none" in the list. Forgery via alg confusion blocked.
// VC079 must NOT fire.

const jwt = require("jsonwebtoken");

const ALLOWED_ALGS = ["RS256", "ES256"];

function verifyToken(token, publicKey) {
  return jwt.verify(token, publicKey, { algorithms: ALLOWED_ALGS });
}

module.exports = { verifyToken };
