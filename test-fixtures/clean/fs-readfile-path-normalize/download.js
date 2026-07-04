// Path traversal-safe download: normalize the resolved path and reject
// anything that escapes the uploads directory. VC025 must NOT fire.

const fs = require("node:fs/promises");
const path = require("node:path");

const UPLOADS_DIR = path.resolve("/app/uploads");

async function download(req, res) {
  const candidate = path.resolve(UPLOADS_DIR, req.query.file);
  if (!candidate.startsWith(UPLOADS_DIR + path.sep)) {
    return res.status(400).json({ error: "invalid path" });
  }
  const data = await fs.readFile(candidate);
  res.type("application/octet-stream").send(data);
}

module.exports = { download };
