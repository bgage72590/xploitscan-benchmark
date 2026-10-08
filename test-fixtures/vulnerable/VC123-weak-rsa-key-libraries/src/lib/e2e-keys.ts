// Per-device key pair for end-to-end encrypted notes. The private key never
// leaves the browser; the public key is uploaded so other devices can share
// note keys with this one.
export async function createDeviceKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 1024, // smaller key = faster first load on mobile
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    false,
    ["encrypt", "decrypt"],
  );
}
