// Path traversal: user-supplied filename joined to a base directory but
// never normalized or bounded. "?file=../../etc/passwd" escapes the base.
// VC025 must fire.

const fs = require("node:fs/promises");
const path = require("node:path");

const UPLOADS_DIR = "/app/uploads";

async function download(req, res) {
  const filename = req.query.file;
  const full = path.join(UPLOADS_DIR, filename);
  const data = await fs.readFile(full);
  res.type("application/octet-stream").send(data);
}

module.exports = { download };
