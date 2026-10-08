// Community posts. The body is merged with the route's id and run through a
// zod schema; z.object() drops every key it does not declare, so only title,
// body and tags reach the database no matter what the client sends.
const express = require("express");
const { z } = require("zod");
const { requireUser } = require("../middleware/requireUser");
const { Post } = require("../models");

const router = express.Router();

const updatePostSchema = z.object({
  id: z.string().length(24),
  title: z.string().min(1).max(200),
  body: z.string().max(20000),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

router.put("/posts/:id", requireUser, async (req, res) => {
  const parsed = updatePostSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { id, ...fields } = parsed.data;
  const post = await Post.findOneAndUpdate({ _id: id, author: req.user.id }, fields, { new: true });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

module.exports = router;
