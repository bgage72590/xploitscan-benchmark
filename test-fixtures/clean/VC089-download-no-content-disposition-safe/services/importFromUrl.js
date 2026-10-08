// "Import from URL": the server downloads a file a member links to into the
// uploads directory, then records it like any other upload. Nothing here is
// sent to a browser — the bytes are piped to disk.
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { db } = require("../lib/db");
const { assertPublicHttpsUrl } = require("../lib/urls");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

async function importFromUrl(workspaceId, rawUrl) {
  const url = await assertPublicHttpsUrl(rawUrl);
  const storageKey = crypto.randomUUID();
  const dest = path.join(UPLOAD_DIR, storageKey);

  const mimeType = await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`download failed: ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => resolve(res.headers["content-type"] || "application/octet-stream"));
      file.on("error", reject);
    }).on("error", reject);
  });

  const { size } = await fs.promises.stat(dest);
  return db.file.create({
    data: { workspaceId, storageKey, mimeType, size, originalName: path.basename(url.pathname) },
  });
}

module.exports = { importFromUrl };
