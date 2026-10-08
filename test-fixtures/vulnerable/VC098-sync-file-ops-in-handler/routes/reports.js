// Monthly report endpoints. Each request reads the template and writes the
// rendered report with the *Sync fs APIs, so the whole Node process stops
// serving every other user while the disk I/O runs — on a slow volume a
// handful of concurrent report requests stalls the API. VC098 must fire.

const express = require("express");
const fs = require("fs");
const path = require("path");
const { renderReport } = require("../lib/render");
const { requireUser } = require("../middleware/requireUser");

const router = express.Router();
const REPORTS_DIR = path.join(__dirname, "..", "storage", "reports");

router.post("/reports/monthly", requireUser, async (req, res) => {
  const { month } = req.body;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(month))) {
    return res.status(400).json({ error: "month must be YYYY-MM" });
  }
  const template = fs.readFileSync(path.join(__dirname, "..", "templates", "monthly.html"), "utf8");
  const html = await renderReport(template, { userId: req.user.id, month });

  const userDir = path.join(REPORTS_DIR, String(req.user.id));
  fs.mkdirSync(userDir, { recursive: true });
  const outFile = path.join(userDir, `${month}.html`);
  fs.writeFileSync(outFile, html);

  res.status(201).json({ month, bytes: Buffer.byteLength(html) });
});

module.exports = router;
