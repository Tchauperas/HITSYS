const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginSuccess: (token) => ipcRenderer.send("Login-success", token),
  onReceiveToken: (callback) => ipcRenderer.on("user-token", (_, token) => callback(token))
});
