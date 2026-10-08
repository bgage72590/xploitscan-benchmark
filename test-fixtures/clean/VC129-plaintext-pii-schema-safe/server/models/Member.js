const mongoose = require("mongoose");
const { memberDataKeyId } = require("../config/encryption");

// Client-side field level encryption: the driver encrypts taxId with a data
// key held in the KMS before the document leaves the app.
const memberSchema = new mongoose.Schema(
  {
    name: String,
    taxId: {
      type: String,
      encrypt: { keyId: [memberDataKeyId], algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic" },
    },
  },
  { encryptionType: "csfle" },
);

module.exports = mongoose.model("Member", memberSchema);
