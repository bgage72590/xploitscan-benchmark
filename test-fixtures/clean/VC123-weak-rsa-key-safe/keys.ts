import { generateKeyPairSync } from "crypto";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const KEY_DIR = path.join(process.cwd(), ".keys");

// Generate the RS256 key pair used to sign session JWTs on first boot.
// 4096-bit modulus: generated once, so the cost is paid a single time.
export function ensureSigningKeys() {
  if (existsSync(path.join(KEY_DIR, "private.pem"))) return;
  mkdirSync(KEY_DIR, { recursive: true });

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  writeFileSync(path.join(KEY_DIR, "public.pem"), publicKey);
  writeFileSync(path.join(KEY_DIR, "private.pem"), privateKey, { mode: 0o600 });
}
