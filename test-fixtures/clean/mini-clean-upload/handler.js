// Clean upload: magic-byte sniff + size cap + path-resolve boundary check.
// VC038 and VC025 must NOT fire.

const fs = require("node:fs/promises");
const path = require("node:path");
const multer = require("multer");
const { fileTypeFromBuffer } = require("file-type");

const UPLOADS_DIR = path.resolve("/app/uploads");
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "application/pdf"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function saveUpload(req, res) {
  const detected = await fileTypeFromBuffer(req.file.buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    return res.status(400).json({ error: "unsupported_type" });
  }
  const safeName = path.basename(req.file.originalname);
  const target = path.resolve(UPLOADS_DIR, safeName);
  if (!target.startsWith(UPLOADS_DIR + path.sep)) {
    return res.status(400).json({ error: "invalid_path" });
  }
  await fs.writeFile(target, req.file.buffer);
  res.json({ saved: target });
}

module.exports = { upload, saveUpload };
