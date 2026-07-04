// Variables whose names imply hashing / fingerprinting. Even though the
// values are high-entropy hex/base64, the name makes it clear these aren't
// secrets — they're content hashes, ETags, build IDs, etc. ENTROPY must
// not fire on any of these.

export const buildMetadata = {
  // SHA-1 style commit SHA, 40 hex chars.
  commit: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
  // SHA-256 content digest, 64 hex chars.
  contentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  // HTTP ETag value.
  etag: "W/\"686897696a7c876b7e\"",
  // Next.js build identifier.
  buildId: "9a4f2c8b3d1e5f7a8c9b0d1e2f3a4b5c7d8e9f0a",
  // Asset fingerprint used for cache busting.
  assetFingerprint: "af12bc34de56fa78bc90de12fa34bc56de78fa90",
  // CRC32 checksum.
  crc: "d87f7e0c3f2a1b4c5d6e7f8a9b0c1d2e",
};

// Subresource integrity hash — intentionally shipped in HTML <script> tags.
export const sriDigest = "sha384-JcKb8q3iqJ61gNV9KGb8thSsNREXQjf8SNjVN0u9W3zQvJOPsdWFfFdAabXvbvs";
