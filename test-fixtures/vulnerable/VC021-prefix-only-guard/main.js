// Electron IPC handler that reads a renderer-supplied path behind a
// prefix-only guard. With the workspace at ~/Notes, "../Notes-archive/x"
// resolves to ~/Notes-archive/x and passes. VC021 used to accept `startsWith`
// (and `path.resolve`) as validation, so this was silent.

const { app, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

const workspaceDir = path.join(app.getPath("home"), "Notes");

ipcMain.handle("read-note", async (_event, relPath) => {
  const resolved = path.resolve(workspaceDir, relPath);
  if (!resolved.startsWith(workspaceDir)) {
    throw new Error("Access denied: path outside workspace");
  }
  return fs.readFile(resolved, "utf8");
});
