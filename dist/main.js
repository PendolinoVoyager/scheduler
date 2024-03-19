"use strict";
const { app, BrowserWindow, ipcMain } = require('electron');
try {
    if (require('electron-squirrel-startup'))
        app.quit();
}
catch (err) { }
//@ts-ignore
const { db, dbInit } = require('./db');
const ThemeController = require('./IPCControllers/ThemeController');
const DatabaseController = require('./IPCControllers/DatabaseController');
const path = require('node:path');
const env = process.env.NODE_ENV ?? 'production';
const createWindow = () => {
    const win = new BrowserWindow({
        icon: path.join(__dirname, '..', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: env === 'development',
        },
        autoHideMenuBar: env !== 'development',
    });
    win.maximize();
    win.loadFile(path.join(__dirname, 'static', 'index.html')); // Using path.join for platform independence
    return win;
};
// App initialization
app.whenReady().then(() => {
    //TODO: Refactor to App class.
    //Make a single file with all ipc handlers, namespaces etc.
    const themeController = new ThemeController(ipcMain);
    const databaseController = new DatabaseController(ipcMain);
    const win = createWindow();
    //For MacOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// App closing
app.on('window-all-closed', async () => {
    await db.close();
    if (process.platform !== 'darwin')
        app.quit();
});
