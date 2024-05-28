const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('connectionAPI', {
    connect: (command) => ipcRenderer.send('handle-connection', command),
    onResponse: (callback) => ipcRenderer.on('on-server-response', (_evt, res) => callback(res))
})