// JWT signing secret baked into source. Anyone who reads the repo can
// forge tokens for every user. VC031 must fire.

const jwt = require("jsonwebtoken");

const JWT_SECRET = "super-secret-dev-key-2024";

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

module.exports = { signToken };
