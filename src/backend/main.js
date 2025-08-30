const { app, BrowserWindow } = require("electron");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    webPreferences: {
      nodeIntegration: true, // habilite se precisar do Node dentro do renderer
    },
  });

  // Carregar o servidor local (Vite ou outro dev server)
  mainWindow.loadURL("http://localhost:5173/");
});
