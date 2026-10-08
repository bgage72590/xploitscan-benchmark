// GitHub webhook receiver. The payload is logged with the delivery headers
// for tracing, then handed to the handler for its event type.
const express = require("express");
const { verifyGithubSignature } = require("../middleware/verifyGithubSignature");
const { logger } = require("../lib/logger");
const handlers = require("../webhooks/github");

const router = express.Router();

router.post("/webhooks/github", verifyGithubSignature, async (req, res) => {
  const event = req.get("x-github-event");
  const logContext = { ...req.body, event, deliveryId: req.get("x-github-delivery") };
  logger.info(logContext, "github webhook received");
  await handlers[event]?.(req.body);
  res.sendStatus(204);
});

module.exports = router;
