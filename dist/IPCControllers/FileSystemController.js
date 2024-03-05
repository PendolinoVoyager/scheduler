"use strict";
// @ts-ignore
const { IPCController } = require('./IPCController');
module.exports = class FileSystemController extends IPCController {
    constructor(ipcMain) {
        super(ipcMain);
    }
    addHandlers() {
        this.ipcMain.handle('fs:read', (e, fileName) => {
            return 'got it';
        });
    }
};
