const { app, BrowserWindow } = require("electron");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    webPreferences: {
      nodeIntegration: true, 
    },
  });

  mainWindow.loadURL("http://localhost:5173/");
});
