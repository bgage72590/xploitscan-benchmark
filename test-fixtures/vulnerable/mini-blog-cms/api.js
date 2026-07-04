// Blog post create endpoint that mass-assigns the request body into the
// Post model (VC042). Note: spreads include `authorId`, `published`,
// etc. — fields the user shouldn't be able to set.

const express = require("express");
const router = express.Router();

router.post("/posts", async (req, res) => {
  const post = await db.Post.create({ ...req.body });
  res.status(201).json(post);
});

module.exports = router;
