// Monthly report endpoints. File I/O inside the handler uses the promise
// fs API, so the event loop keeps serving other requests while the disk work
// runs. VC098 must NOT fire.

const express = require("express");
const fs = require("fs/promises");
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
  const template = await fs.readFile(path.join(__dirname, "..", "templates", "monthly.html"), "utf8");
  const html = await renderReport(template, { userId: req.user.id, month });

  const userDir = path.join(REPORTS_DIR, String(req.user.id));
  await fs.mkdir(userDir, { recursive: true });
  const outFile = path.join(userDir, `${month}.html`);
  await fs.writeFile(outFile, html);

  res.status(201).json({ month, bytes: Buffer.byteLength(html) });
});

module.exports = router;
