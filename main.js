const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let loginWindow;
let mainWindow;
let userToken = null;
let backendProcess;

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

// Função para esperar o servidor ficar disponível
function waitForServer(port, timeout = 5000) {
  const net = require("net");
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const client = net.createConnection({ port }, () => {
        client.end();
        resolve();
      });

      client.on("error", () => {
        if (Date.now() - start > timeout) {
          reject(new Error("Timeout esperando servidor"));
        } else {
          setTimeout(check, 100); // tenta novamente
        }
      });
    };

    check();
  });
}

app.whenReady().then(async () => {
  const backendScript = path.join(__dirname, "src/backend/server.js");

  backendProcess = spawn("node", [backendScript], {
    detached: true,
    stdio: "inherit",
  });

  try {
    // aguarda o backend iniciar antes de abrir a janela
    await waitForServer(3000, 10000);
    createLoginWindow();
  } catch (err) {
    console.error("Erro: backend não iniciou a tempo", err);
  }
});

ipcMain.on("Login-success", (event, token) => {
  userToken = token;
  if (loginWindow) loginWindow.close();
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess && backendProcess.pid) {
    console.log("Encerrando servidor backend...");
    try {
      process.kill(backendProcess.pid, 0);
      process.kill(-backendProcess.pid);
      console.log("Backend encerrado com sucesso.");
    } catch (error) {
      if (error.code === "ESRCH") {
        console.log("Backend já estava encerrado.");
      } else {
        console.error("Erro ao encerrar backend:", error);
      }
    }
  }

  if (process.platform !== "darwin") app.quit();
});
