// Math.random() is a non-cryptographic PRNG — predictable once an
// attacker observes a few outputs. Using it to mint session tokens is
// a well-known break. VC034 must fire.

function generateSessionToken() {
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += Math.floor(Math.random() * 16).toString(16);
  }
  return token;
}

module.exports = { generateSessionToken };
