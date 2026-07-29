// A webhook receiver in a camelCase file. `webhookHandler` has no separator
// between `webhook` and `Handler`, so a segment-delimited path test misses it
// while the original `/webhook` substring test matched it.
import express from "express";

const router = express.Router();

router.post("/inbound", async (req, res) => {
  const event = req.body;
  await recordEvent(event);
  res.json({ received: true });
});

async function recordEvent(event: unknown) {
  console.log("event", event);
}

export default router;
