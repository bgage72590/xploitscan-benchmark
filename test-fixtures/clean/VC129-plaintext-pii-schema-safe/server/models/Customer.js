const mongoose = require("mongoose");
const { fieldEncryption } = require("mongoose-field-encryption");

// Cards are tokenized by Stripe (only the customer id and last 4 are kept);
// the SSN is encrypted at rest by mongoose-field-encryption below.
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    ssn: { type: String, required: true },
    stripeCustomerId: String,
    cardLast4: String,
  },
  { timestamps: true },
);

customerSchema.plugin(fieldEncryption, {
  fields: ["ssn"],
  secret: process.env.FIELD_ENCRYPTION_SECRET,
});

module.exports = mongoose.model("Customer", customerSchema);
