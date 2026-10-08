const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    ssn: { type: String, required: true },
    creditCardNumber: String,
    cvv: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
