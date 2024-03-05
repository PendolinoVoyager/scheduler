"use strict";
// @ts-ignore
class IPCController {
    constructor(ipcMain) {
        this.ipcMain = ipcMain;
        this.addHandlers();
    }
    addHandlers() {
        throw new Error(`Method addHandlers isn't implemented.`);
    }
}
module.exports = { IPCController };
