import { app, BrowserWindow } from "electron";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // habilite se precisar do Node dentro do renderer
    },
  });

  // Carregar o servidor local (Vite ou outro dev server)
  mainWindow.loadURL("http://localhost:5173/");
});
