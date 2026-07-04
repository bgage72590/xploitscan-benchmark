// Encryption key loaded from the environment at startup. Nothing in
// source carries a material value. VC062 must NOT fire.

const crypto = require("node:crypto");

const AES_KEY = Buffer.from(process.env.AES_KEY_HEX, "hex");
if (AES_KEY.length !== 32) {
  throw new Error("AES_KEY_HEX must decode to 32 bytes");
}

function encrypt(plain) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, iv);
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, enc]).toString("hex");
}

module.exports = { encrypt };
