// User creation with an explicit picker — only the fields the client
// is allowed to set ever reach the ORM. No server-only field can be
// injected from the request. VC042 must NOT fire.

async function createUser(req, res) {
  const user = await db.User.create({
    email: String(req.body.email ?? ""),
    name: String(req.body.name ?? ""),
    plan: "free",
    role: "member",
    isAdmin: false,
  });
  res.status(201).json(user);
}

module.exports = { createUser };
