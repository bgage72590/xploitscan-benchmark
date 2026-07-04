// Upload handler that joins user-supplied filename to disk without
// boundary checks. Attacker can write under /app/uploads/../../etc/...
// VC025 must fire.

const fs = require("node:fs/promises");
const path = require("node:path");

const UPLOADS_DIR = "/app/uploads";

async function saveUpload(req, res) {
  const target = path.join(UPLOADS_DIR, req.body.filename);
  await fs.writeFile(target, req.file.buffer);
  res.json({ saved: target });
}

module.exports = { saveUpload };
