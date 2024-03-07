// @ts-ignore
const { IPCController } = require('./IPCController');
const fs = require('node:fs');
module.exports = class FileSystemController extends IPCController {
  constructor(ipcMain: any) {
    super(ipcMain);
  }
  addHandlers() {
    this.ipcMain.handle('fs:read', (e: Event, fileName: string) => {
      return 'got it';
    });
    this.ipcMain.handle('fs:write', (e: Event, text: string) => {
      fs.writeFile('./test.txt', text ?? 'Hello world!', (err: Error) => {
        if (err) return 'FAIL';
      });
    });
  }
};
