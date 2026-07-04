// AES-256 key baked into source. Anyone with read access to the repo
// (including ex-employees, public fork watchers) can decrypt every
// value this key ever encrypted. VC062 must fire.

const crypto = require("node:crypto");

const AES_KEY = Buffer.from(
  "7f3a9b1d5c2e4f8a6b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a",
  "hex",
);
const IV = Buffer.from("000102030405060708090a0b0c0d0e0f", "hex");

function encrypt(plain) {
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, IV);
  return Buffer.concat([cipher.update(plain), cipher.final()]).toString("hex");
}

module.exports = { encrypt };
