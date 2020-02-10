const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const path = require("path");
const isDev = require("electron-is-dev");
const url = require('url')

app.allowRendererProcessReuse = false;

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "./", "node_modules", ".bin", "electron")
  });
}

let win;

app.on("ready", createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
  }
});
app.on("activate", () => {
	if (win === null) {
		createWindow();
  }
});

function createWindow() {
  const point = electron.screen.getCursorScreenPoint();
  const curArea = electron.screen.getDisplayNearestPoint(point).workArea;
  win = new BrowserWindow({
    x: curArea.x,
    y: curArea.y,
    width: isDev ? curArea.width / 2 : curArea.width,
    height: curArea.height,
    minHeight: 400,
    minWidth: 600,
    show: false,
    webPreferences: {
      devTools: isDev
    }
  });
  if (isDev) {
    win.loadURL("http://localhost:8080");
    win.webContents.openDevTools();
    win.showInactive();
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
    win.show();
    win.maximize();
  }

  win.on("closed", () => (win = null));
}
