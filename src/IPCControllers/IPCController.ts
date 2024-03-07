// @ts-ignore
class IPCController {
  protected ipcMain: any;
  constructor(ipcMain: any) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  addHandlers(): void {}
}
module.exports = { IPCController };
