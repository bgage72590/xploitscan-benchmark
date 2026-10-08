const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/fieldCrypto");

// The SSN and bank account number are encrypted by the setters before they
// reach MongoDB and decrypted by the getters on read.
const applicantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    ssn: { type: String, set: encrypt, get: decrypt },
    bankAccountNumber: { type: String, set: encrypt, get: decrypt },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } },
);

module.exports = mongoose.model("Applicant", applicantSchema);
