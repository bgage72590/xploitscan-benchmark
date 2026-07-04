// Payment integration referencing the published network TEST cards. These are
// Luhn-valid with real prefixes, but they're documented test PANs — VC211 must
// NOT fire on them (they're excluded by value).
const TEST_CARDS = {
  visa: "4242424242424242",
  visaDebit: "4000056655665556",
  mastercard: "5555555555554444",
  amex: "378282246310005",
  declined: "4000000000000002",
};

function runCheckoutSmoke() {
  return Object.values(TEST_CARDS);
}

module.exports = { TEST_CARDS, runCheckoutSmoke };
