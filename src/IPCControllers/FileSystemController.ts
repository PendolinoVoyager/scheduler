// @ts-ignore
const { IPCController } = require('./IPCController');
module.exports = class FileSystemController extends IPCController {
  constructor(ipcMain: any) {
    super(ipcMain);
  }
  addHandlers() {
    this.ipcMain.handle('fs:read', (e: Event, fileName: string) => {
      return 'got it';
    });
  }
};
