// Payment helper with a real card number hardcoded in source — VC211 must fire.
const customer = {
  name: "Jane Doe",
  cardNumber: "4539123456789017",
};

function charge() {
  return processPayment(customer.cardNumber, 4999);
}

module.exports = { charge };
