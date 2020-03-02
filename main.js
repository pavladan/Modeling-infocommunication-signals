const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");

app.allowRendererProcessReuse = false;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

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
    addElectronReload();
    addExtensions();
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

function addExtensions() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS
  } = require("electron-devtools-installer");
  installExtension([REACT_DEVELOPER_TOOLS])
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log("An error occurred: ", err));
}
function addElectronReload() {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "./", "node_modules", ".bin", "electron")
  });
}
