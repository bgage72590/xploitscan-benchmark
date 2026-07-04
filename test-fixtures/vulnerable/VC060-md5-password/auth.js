// MD5 for password hashing. Fast, broken against rainbow tables, and
// tuned for speed — every major guide has called this out for 15+ years.
// VC060 must fire.

const crypto = require("node:crypto");

function hashPassword(plain) {
  return crypto.createHash("md5").update(plain).digest("hex");
}

function verifyPassword(plain, stored) {
  return hashPassword(plain) === stored;
}

module.exports = { hashPassword, verifyPassword };
