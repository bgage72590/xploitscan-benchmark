const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("notes", {
  openFile: () => ipcRenderer.invoke("open-file-dialog"),
});
