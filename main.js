const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let loginWindow;
let mainWindow;
let userToken = null;

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 512,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  loginWindow.loadURL("http://localhost:3000/");
};

function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000/home");

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();

    if (userToken) {
      mainWindow.webContents.send("user-token", userToken);
    }
  });
}

app.whenReady().then(() => {
  createLoginWindow();
});

ipcMain.on("Login-success", (event, token) => {
  userToken = token;
  if (loginWindow) loginWindow.close();
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
