// Session tokens minted from crypto.randomBytes — CSPRNG, unpredictable.
// VC034 must NOT fire.

const crypto = require("node:crypto");

function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { generateSessionToken };
