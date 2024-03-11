"use strict";
const ThemeController = require('./IPCControllers/ThemeController');
const FileSystemController = require('./IPCControllers/FileSystemController');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
if (require('electron-squirrel-startup'))
    app.quit();
const createWindow = () => {
    const win = new BrowserWindow({
        skipTaskbar: true,
        titleBarStyle: 'hidden',
        icon: `${__dirname}/../icon.png`,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.maximize();
    win.loadFile('../static/index.html');
    return win;
};
// App initialization
app.whenReady().then(() => {
    //TODO: Refactor to App class.
    //Make a single file with all ipc handlers, namespaces etc.
    const themeController = new ThemeController(ipcMain);
    const fileSystemController = new FileSystemController(ipcMain);
    const win = createWindow();
    //For MacOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// App closing
app.on('window-all-closed', () => {
    console.log('goodbye!');
    if (process.platform !== 'darwin')
        app.quit();
});
