const { app, BrowserWindow } = require('electron')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})
