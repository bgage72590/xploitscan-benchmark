import crypto from "crypto";

// Encrypts third-party API tokens before we store them in the integrations
// table, so a database dump doesn't leak them in plaintext.
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function encrypt(plaintext: string): string {
  const cipher = crypto.createCipheriv("aes-256-ecb", ENCRYPTION_KEY, null);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(ciphertext: string): string {
  const decipher = crypto.createDecipheriv("aes-256-ecb", ENCRYPTION_KEY, null);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
