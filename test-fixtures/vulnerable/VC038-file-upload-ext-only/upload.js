// Upload handler gating only on the filename extension. An attacker can
// rename exploit.php to exploit.jpg and slip past. Real validation needs
// magic bytes / MIME. VC038 must fire.

const multer = require("multer");

const upload = multer({
  fileFilter(_req, file, cb) {
    const allowed = [".jpg", ".png", ".pdf"];
    const ok = allowed.some((ext) => file.originalname.endsWith(ext));
    cb(null, ok);
  },
});

module.exports = upload;
