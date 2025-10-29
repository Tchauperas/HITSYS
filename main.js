const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true, // Inicia em tela cheia real
    resizable: false, // Desativa redimensionamento
    frame: false, // Remove a barra de título (opcional)
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000/");
}

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
    createMainWindow();
  } catch (err) {
    console.error("Erro: backend não iniciou a tempo", err);
  }
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
