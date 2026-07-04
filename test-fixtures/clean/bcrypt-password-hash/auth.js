// bcrypt with a cost factor of 12 — intentionally slow, salted, widely
// recommended for password storage. VC060 must NOT fire.

const bcrypt = require("bcrypt");

const COST = 12;

async function hashPassword(plain) {
  return bcrypt.hash(plain, COST);
}

async function verifyPassword(plain, stored) {
  return bcrypt.compare(plain, stored);
}

module.exports = { hashPassword, verifyPassword };
