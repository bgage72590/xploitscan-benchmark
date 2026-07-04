// Sequelize signup that enumerates fields explicitly. No mass-assignment
// surface. VC042 must NOT fire.

const { User } = require("../models");

async function signup(req, res) {
  const user = User.build({
    email: String(req.body.email ?? ""),
    name: String(req.body.name ?? ""),
    role: "member",
  });
  await user.save();
  res.status(201).json({ id: user.id });
}

module.exports = { signup };
