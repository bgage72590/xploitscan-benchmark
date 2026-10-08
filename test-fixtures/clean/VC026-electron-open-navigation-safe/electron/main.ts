import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const INDEX_HTML = path.join(__dirname, "../dist/index.html");

let win: BrowserWindow | null = null;

// The app's own pages: the Vite dev server origin, or the bundled index.html
// (hash routes included). Anything else is external.
function isAppUrl(url: string): boolean {
  if (VITE_DEV_SERVER_URL) return new URL(url).origin === new URL(VITE_DEV_SERVER_URL).origin;
  return url.split("#")[0] === pathToFileURL(INDEX_HTML).href;
}

function openInBrowser(url: string) {
  // Only web links go to the system browser — never file:, smb: or custom protocols.
  if (new URL(url).protocol === "https:") shell.openExternal(url);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../public/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Feed links never navigate the app window itself...
  win.webContents.on("will-navigate", (event, url) => {
    if (isAppUrl(url)) return;
    event.preventDefault();
    openInBrowser(url);
  });

  // ...and never open new Electron windows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    openInBrowser(url);
    return { action: "deny" };
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(INDEX_HTML);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);
