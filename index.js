const {
    app,
    BrowserWindow
} = require('electron');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let win;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL('file://' + __dirname + '/index.html');
}

app.on('ready', function () {
    createWindow();
})

app.on('window-all-closed', function () {
    app.quit();
});