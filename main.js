const { app, BrowserWindow } = require("electron")
const path = require("path")
const { spawn } = require("child_process")
const fs = require("fs")

let mainWindow
let backendProcess

function createMainWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: true, // Inicia em tela cheia real
        resizable: false, // Desativa redimensionamento
        frame: false, // Remove a barra de título (opcional)
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    mainWindow.loadURL("http://localhost:3000/")
}

function waitForServer(port, timeout = 5000) {
    const net = require("net")
    return new Promise((resolve, reject) => {
        const start = Date.now()

        const check = () => {
            const client = net.createConnection({ port }, () => {
                client.end()
                resolve()
            })

            client.on("error", () => {
                if (Date.now() - start > timeout) {
                    reject(new Error("Timeout esperando servidor"))
                } else {
                    setTimeout(check, 100) // tenta novamente
                }
            })
        }

        check()
    })
}

app.whenReady().then(async () => {
    const backendScript = path.join(__dirname, "src/backend/server.js")

    // Verifica se o arquivo do servidor existe
    if (!fs.existsSync(backendScript)) {
        console.error("Arquivo do servidor não encontrado:", backendScript)
        app.quit()
        return
    }

    console.log("Iniciando servidor backend em:", backendScript)
    console.log("Diretório atual:", __dirname)

    backendProcess = spawn("node", [backendScript], {
        detached: false,
        stdio: ["ignore", "pipe", "pipe"],
        cwd: __dirname,
        env: { ...process.env, NODE_ENV: "production" },
    })

    // Captura saída do servidor para debug
    backendProcess.stdout.on("data", (data) => {
        console.log(`[Backend]: ${data.toString()}`)
    })

    backendProcess.stderr.on("data", (data) => {
        console.error(`[Backend Error]: ${data.toString()}`)
    })

    backendProcess.on("error", (error) => {
        console.error("Erro ao iniciar backend:", error)
    })

    backendProcess.on("exit", (code, signal) => {
        console.log(`Backend encerrado com código ${code} e sinal ${signal}`)
    })

    try {
        // aguarda o backend iniciar antes de abrir a janela
        await waitForServer(3000, 15000)
        console.log("Servidor backend iniciado com sucesso!")
        createMainWindow()
    } catch (err) {
        console.error("Erro: backend não iniciou a tempo", err)
        app.quit()
    }
})

app.on("window-all-closed", () => {
    if (backendProcess && !backendProcess.killed) {
        console.log("Encerrando servidor backend...")

        if (process.platform === "win32") {
            // No Windows, usa tree-kill ou taskkill
            try {
                const treeKill = require("tree-kill")
                treeKill(backendProcess.pid, "SIGTERM", (err) => {
                    if (err) {
                        console.error("Erro ao encerrar backend:", err)
                    } else {
                        console.log("Backend encerrado com sucesso.")
                    }
                })
            } catch (error) {
                // Fallback: usa taskkill do Windows
                spawn("taskkill", ["/pid", backendProcess.pid, "/f", "/t"])
            }
        } else {
            // Unix/Linux/MacOS
            try {
                process.kill(-backendProcess.pid, "SIGTERM")
                console.log("Backend encerrado com sucesso.")
            } catch (error) {
                console.error("Erro ao encerrar backend:", error)
            }
        }
    }

    if (process.platform !== "darwin") app.quit()
})
