// File sharing for project workspaces: members upload files and anyone in
// the workspace can fetch them. res.attachment() marks every response as a
// file to save under its original name, and nosniff stops the browser from
// second-guessing the type, so an uploaded .html or .svg is saved to disk
// instead of rendering on the app's origin. VC089 must NOT fire.

const express = require("express");
const fs = require("fs");
const path = require("path");
const { db } = require("../lib/db");
const { requireMember } = require("../middleware/requireMember");

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

router.get("/:workspaceId/files/:fileId/download", requireMember, async (req, res) => {
  const file = await db.file.findFirst({
    where: { id: req.params.fileId, workspaceId: req.params.workspaceId },
  });
  if (!file) return res.status(404).json({ error: "Not found" });

  res.attachment(file.originalName);
  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Length", file.size);
  res.setHeader("X-Content-Type-Options", "nosniff");
  fs.createReadStream(path.join(UPLOAD_DIR, file.storageKey)).pipe(res);
});

module.exports = router;
