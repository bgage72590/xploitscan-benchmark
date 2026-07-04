// Analytics ingest endpoint. Logs raw event payload (VC044) and stores
// it via Mongo find/upsert with raw req.body filter (VC048).

const express = require("express");
const router = express.Router();

router.post("/events", async (req, res) => {
  const event = req.body;
  console.log(`event ingested: ${JSON.stringify(event)} from ${event.user}`);
  await db.collection("events").findOneAndUpdate(req.body, { $set: event }, { upsert: true });
  res.status(202).end();
});

module.exports = router;
