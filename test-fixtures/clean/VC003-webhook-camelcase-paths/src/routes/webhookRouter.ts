// Same shape, different camelCase suffix. Pinned because the two names fail
// the segment test for the same reason and a partial fix would pass one.
import express from "express";

const router = express.Router();

router.post("/events", async (req, res) => {
  await queue.push(req.body);
  res.status(202).end();
});

const queue = { push: async (_: unknown) => {} };

export default router;
