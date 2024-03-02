// @ts-ignore
class IPCController {
  protected ipcMain: any;
  constructor(ipcMain: any) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  addHandlers(): void {
    throw new Error(`Method addHandlers isn't implemented.`);
  }
}
module.exports = { IPCController };
