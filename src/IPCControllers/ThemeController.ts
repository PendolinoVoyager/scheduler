const { nativeTheme } = require('electron');
// @ts-ignore
const { IPCController } = require('./IPCController');

module.exports = class ThemeController extends IPCController {
  constructor(ipcMain: any) {
    super(ipcMain);
  }
  addHandlers() {
    this.ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
      } else {
        nativeTheme.themeSource = 'dark';
      }
      return nativeTheme.shouldUseDarkColors;
    });
    this.ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system';
    });
  }
};
