const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const db = require("../db");

const router = express.Router();

// POST /avatar — resize the uploaded image and save it on the user's profile
router.post("/avatar", (req, res) => {
  fs.readFile(req.file.path, (err, buffer) => {
    if (err) return res.status(500).json({ error: "Upload failed" });
    sharp(buffer)
      .resize(256, 256)
      .toBuffer((err, resized) => {
        if (err) return res.status(500).json({ error: "Resize failed" });
        const out = path.join(__dirname, "../../uploads", `${req.user.id}.png`);
        fs.writeFile(out, resized, (err) => {
          if (err) return res.status(500).json({ error: "Save failed" });
          db.query(
            "UPDATE users SET avatar_url = $1 WHERE id = $2",
            [`/uploads/${req.user.id}.png`, req.user.id],
            (err) => {
              if (err) return res.status(500).json({ error: "Database error" });
              res.json({ ok: true });
            },
          );
        });
      });
  });
});

module.exports = router;
