// Multer config that filters by extension only — no magic-byte check.
// Attacker uploads exploit.php renamed to exploit.jpg. VC038 must fire.

const multer = require("multer");

const upload = multer({
  fileFilter(_req, file, cb) {
    const ok = /\.(?:jpg|jpeg|png|pdf)$/i.test(file.originalname);
    cb(null, ok);
  },
});

module.exports = upload;
