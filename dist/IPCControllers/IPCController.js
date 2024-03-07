"use strict";
// @ts-ignore
class IPCController {
    constructor(ipcMain) {
        this.ipcMain = ipcMain;
        this.addHandlers();
    }
    addHandlers() { }
}
module.exports = { IPCController };
