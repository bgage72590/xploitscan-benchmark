// jwt.verify() configured to accept "none" as an algorithm. An attacker
// can forge a token with {"alg":"none"} and an empty signature and it
// will validate. VC079 must fire.

const jwt = require("jsonwebtoken");

function verifyToken(token, secret) {
  return jwt.verify(token, secret, {
    algorithms: ["HS256", "none"],
  });
}

module.exports = { verifyToken };
