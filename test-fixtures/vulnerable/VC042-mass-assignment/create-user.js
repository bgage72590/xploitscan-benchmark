// Spreading req.body into User.create() lets clients set server-only
// fields like `isAdmin`, `role`, or `emailVerified`. Textbook mass
// assignment. VC042 must fire.

async function createUser(req, res) {
  const user = await db.User.create({
    ...req.body,
  });
  res.status(201).json(user);
}

module.exports = { createUser };
