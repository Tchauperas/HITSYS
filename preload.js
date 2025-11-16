//preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI',{
    minimize: ()  => ipcRenderer.send('window-minimize'),
    close: () => ipcRenderer.send('window-close'),

    onReceiveToken: (callback) => ipcRenderer.on("receive-token",(event,data) => callback(data),)
})
