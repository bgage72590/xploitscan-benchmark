// Path traversal behind a prefix-only guard. The check compares characters,
// not path components: with UPLOAD_DIR = /app/uploads, the name
// "../uploads-private/keys.json" resolves to /app/uploads-private/keys.json,
// which starts with "/app/uploads" and passes.
//
// VC117 and VC025 used to treat any startsWith as proof of containment, so
// this guard silenced both. They must fire; VC223 names the guard itself.

const fs = require("node:fs");
const path = require("node:path");

const UPLOAD_DIR = path.join(__dirname, "uploads");

function download(req, res) {
  const target = path.resolve(UPLOAD_DIR, req.query.name);
  if (!target.startsWith(UPLOAD_DIR)) {
    return res.status(403).end();
  }
  res.type("application/octet-stream").send(fs.readFileSync(target));
}

module.exports = { download };
