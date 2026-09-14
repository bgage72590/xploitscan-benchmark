// Sequelize .find({ where }) scoped by the owner. The widened lookup regex
// now recognizes this call shape, so the ownership guard has to recognize
// the scoping too or this becomes a false positive.
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/orders/:id", async (req, res) => {
  const order = await db.Order.find({
    where: { id: req.params.id, ownerId: req.user.id },
  });
  res.json(order);
});

module.exports = router;
