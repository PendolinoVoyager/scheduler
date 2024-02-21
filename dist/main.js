"use strict";
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const createWindow = () => {
    const win = new BrowserWindow({
        skipTaskbar: true,
        titleBarStyle: 'hidden',
        icon: `${__dirname}/../icon.png`,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.maximize();
    win.loadFile('../index.html');
    return win;
};
app.whenReady().then(() => {
    const win = createWindow();
    //For MacOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
    ipcMain.handle('read', (e, fileName) => {
        console.log(fileName);
        return 'got it';
    });
});
app.on('window-all-closed', (e) => {
    console.log('goodbye!');
    if (process.platform !== 'darwin')
        app.quit();
});
