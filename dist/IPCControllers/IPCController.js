"use strict";
module.exports.IPCController = class IPCController {
    constructor(ipcMain) {
        this.ipcMain = ipcMain;
        this.addHandlers();
    }
    addHandlers() {
        throw new Error(`Method addHandlers isn't implemented.`);
    }
};
