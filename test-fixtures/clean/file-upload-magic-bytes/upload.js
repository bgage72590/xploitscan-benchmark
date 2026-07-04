// multer wired with file-type detection on actual bytes + mimetype cross-check.
// Extension alone is not trusted. VC038 must NOT fire.

const multer = require("multer");
const { fileTypeFromBuffer } = require("file-type");

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "application/pdf"]);

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  async fileFilter(_req, file, cb) {
    const chunks = [];
    file.stream.on("data", (c) => chunks.push(c));
    file.stream.on("end", async () => {
      const detected = await fileTypeFromBuffer(Buffer.concat(chunks));
      cb(null, Boolean(detected && ALLOWED_MIME.has(detected.mime) && ALLOWED_MIME.has(file.mimetype)));
    });
  },
});

module.exports = upload;
