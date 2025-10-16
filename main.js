const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const { spawn } = require("child_process")

let loginWindow
let mainWindow
let userToken = null
let backendProcess

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 500,
    height: 386,
    resizable: false,
    frame: false,
    transparent: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  })

  loginWindow.loadURL("http://localhost:3000/")
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL("http://localhost:3000/home")

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize()
    mainWindow.show()

    if (userToken) {
      mainWindow.webContents.send("user-token", userToken)
    }
  })
}

app.whenReady().then(() => {
  const backendScript = path.join(__dirname, "src/backend/server.js")

  backendProcess = spawn("node", [backendScript], {
    stdio: "inherit",
    shell: true,
  })

  createLoginWindow()
})

ipcMain.on("Login-success", (event, token) => {
  userToken = token
  if (loginWindow) loginWindow.close()
  createMainWindow()
})

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill()
  if (process.platform !== "darwin") app.quit()
})
