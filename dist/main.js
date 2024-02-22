"use strict";
const ThemeController = require('./IPCControllers/ThemeController');
const FileSystemController = require('./IPCControllers/FileSystemController');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
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
    win.loadFile('../index.html');
    const themeController = new ThemeController(ipcMain);
    const fileSystemController = new FileSystemController(ipcMain);
    return win;
};
app.whenReady().then(() => {
    const win = createWindow();
    //For MacOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', (e) => {
    console.log('goodbye!');
    if (process.platform !== 'darwin')
        app.quit();
});
