// === on secret strings is timing-sensitive: the comparison short-circuits
// on the first differing byte, which leaks length and prefix information
// over the wire. VC043 must fire.

const EXPECTED_API_KEY = process.env.INTERNAL_API_KEY;

function authenticate(req, res, next) {
  const provided = req.headers["x-api-key"];
  if (provided === EXPECTED_API_KEY) {
    return next();
  }
  return res.status(401).json({ error: "unauthorized" });
}

module.exports = { authenticate };
