// File sharing for project workspaces: members upload files and anyone in
// the workspace can fetch them. The handler streams the stored bytes back
// with the uploader's MIME type and never marks the response as a file to
// save, so an uploaded .html or .svg renders inline on the app's own origin
// and its script runs with the viewer's session. VC089 must fire.

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

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Length", file.size);
  fs.createReadStream(path.join(UPLOAD_DIR, file.storageKey)).pipe(res);
});

module.exports = router;
