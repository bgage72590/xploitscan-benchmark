// Sequelize .build() + .save() with req.body spread in. VC042 must fire
// via the AST layer — .build is in the ORM_METHODS set.

const { User } = require("../models");

async function signup(req, res) {
  const user = User.build({ ...req.body });
  await user.save();
  res.status(201).json({ id: user.id });
}

module.exports = { signup };
