// Hosted landing pages: each customer uploads a zip of their static site,
// which is unpacked under SITES_DIR and served from the app's own origin.
// The uploaded index.html renders inline on that origin, so a customer's
// script runs with every visitor's session cookie. VC089 must fire.
const express = require("express");
const path = require("path");
const { Site } = require("../models");

const router = express.Router();
const SITES_DIR = path.join(__dirname, "..", "uploads", "sites");

router.get("/sites/:siteId", async (req, res) => {
  const site = await Site.findByPk(req.params.siteId);
  if (!site || !site.published) return res.status(404).send("Not found");

  res.sendFile(path.join(SITES_DIR, req.params.siteId, "index.html"));
});

module.exports = router;
