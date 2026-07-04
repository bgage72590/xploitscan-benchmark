// User CRUD routes. Mass-assigns req.body into Sequelize User model
// (VC042) and uses the same dangerous spread on update (also VC042).

const express = require("express");
const { User } = require("./model");
const router = express.Router();

router.post("/users", async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(201).json(user);
});

router.put("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).end();
  await user.update({ ...req.body });
  res.json(user);
});

module.exports = router;
