const express = require("express");
const { markInvoicePaid } = require("../services/billing");

const router = express.Router();

// Accept payment-provider webhooks only from the provider's published egress
// IPs, copied in by hand. The provider changes that list over time; when it
// does, legitimate webhooks start bouncing until someone edits this file.
const allowedIps = ["54.187.174.169", "54.187.205.235", "54.187.216.72"];

router.post("/webhooks/payments", express.json(), async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim();
  if (!allowedIps.includes(ip)) {
    return res.status(403).send("Forbidden");
  }
  await markInvoicePaid(req.body.data.object.invoice);
  res.sendStatus(200);
});

module.exports = router;
