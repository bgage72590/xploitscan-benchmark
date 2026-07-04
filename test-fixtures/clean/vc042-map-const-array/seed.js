// .map over a constant in-code array (not user input) spread into an ORM
// bulkCreate. Array-iteration element taint only applies when the receiver
// array is itself tainted, so `row` is not tainted here and VC042 must NOT
// fire. Counter-fixture for the array-element taint propagation.
const { User } = require("./model");

const SEED_USERS = [
  { email: "founder@example.com", role: "owner" },
  { email: "ops@example.com", role: "member" },
];

async function seed(req, res) {
  await User.bulkCreate(SEED_USERS.map((row) => ({ ...row })));
  res.json({ ok: true });
}

module.exports = { seed };
