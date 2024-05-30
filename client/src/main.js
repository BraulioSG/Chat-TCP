const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const Connection = require('./utils/connection');

let userId = "usr-000";

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('./src/views/login.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    onResponse = (res) => mainWindow.webContents.send('on-server-response', res)
    return mainWindow
}

app.whenReady().then(() => {
    const win = createWindow()

    const client = new Connection((res) => {
        const [type, to, _start, ...json] = res.split("\n")
        const members = to.split(" ");
        json.pop();

        console.log(json);

        if (type === "RESPONSE" || members.indexOf(userId) !== -1) {
            win.webContents.send('on-server-response', JSON.parse(json.join("\n")))
        }
    }, 8080, 8081)

    const handleConnection = (_evt, cmd) => {
        client.send(cmd);
    }

    ipcMain.on('handle-connection', handleConnection);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})