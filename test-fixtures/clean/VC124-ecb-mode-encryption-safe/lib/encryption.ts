import crypto from "crypto";

// Encrypts third-party API tokens before we store them in the integrations
// table, so a database dump doesn't leak them in plaintext.
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

// AES-256-GCM with a fresh 96-bit IV per message; the auth tag is stored
// alongside the ciphertext so tampering is detected on decrypt.
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decrypt(payload: string): string {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}
