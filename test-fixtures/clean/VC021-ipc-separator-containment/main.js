// Electron IPC handlers that contain renderer-supplied paths correctly: one
// appends the separator before comparing, one uses path.relative. VC021 must
// not fire — and neither may VC223.

const { app, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

const workspaceDir = path.join(app.getPath("home"), "Notes");

ipcMain.handle("read-note", async (_event, relPath) => {
  const resolved = path.resolve(workspaceDir, relPath);
  if (resolved !== workspaceDir && !resolved.startsWith(workspaceDir + path.sep)) {
    throw new Error("Access denied: path outside workspace");
  }
  return fs.readFile(resolved, "utf8");
});

ipcMain.handle("write-note", async (_event, relPath, text) => {
  const target = path.resolve(workspaceDir, relPath);
  const rel = path.relative(workspaceDir, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Access denied: path outside workspace");
  }
  await fs.writeFile(target, text, "utf8");
});
