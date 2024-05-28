const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const Client = require('./utils/connection');


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('./src/views/login.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    onResponse = (res) => mainWindow.webContents.send('on-server-response', res)
    return mainWindow
}

app.whenReady().then(() => {
    const win = createWindow()

    const client = new Client((res) => {
        win.webContents.send('on-server-response', res)
    })

    const handleConnection = (_evt, cmd) => {
        client.send(cmd);
    }

    ipcMain.on('handle-connection', handleConnection);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})