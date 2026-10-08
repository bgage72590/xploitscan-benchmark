const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const db = require("../db");

const router = express.Router();

// POST /avatar — resize the uploaded image and save it on the user's profile
router.post("/avatar", async (req, res) => {
  try {
    const buffer = await fs.readFile(req.file.path);
    const resized = await sharp(buffer).resize(256, 256).toBuffer();
    const out = path.join(__dirname, "../../uploads", `${req.user.id}.png`);
    await fs.writeFile(out, resized);
    await db.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      `/uploads/${req.user.id}.png`,
      req.user.id,
    ]);
    res.json({ ok: true });
  } catch (err) {
    console.error("avatar upload failed", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
