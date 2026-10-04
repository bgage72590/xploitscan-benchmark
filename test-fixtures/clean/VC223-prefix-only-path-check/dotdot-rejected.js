const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const UPLOAD_DIR = path.resolve(__dirname, "../uploads");

router.get("/files/:name", (req, res) => {
  const name = req.params.name;
  if (name.includes("..")) {
    return res.status(400).json({ error: "invalid name" });
  }
  const filePath = path.join(UPLOAD_DIR, name);
  if (!filePath.startsWith(UPLOAD_DIR)) {
    return res.status(403).json({ error: "forbidden" });
  }
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router;
