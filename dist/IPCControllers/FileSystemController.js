"use strict";
// @ts-ignore
const { IPCController } = require('./IPCController');
const fs = require('node:fs');
module.exports = class FileSystemController extends IPCController {
    constructor(ipcMain) {
        super(ipcMain);
    }
    addHandlers() {
        this.ipcMain.handle('fs:read', (e, fileName) => {
            return 'got it';
        });
        this.ipcMain.handle('fs:write', (e, text) => {
            fs.writeFile('./test.txt', text ?? 'Hello world!', (err) => {
                if (err)
                    return 'FAIL';
            });
        });
    }
};
