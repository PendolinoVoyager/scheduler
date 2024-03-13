// @ts-ignore
const { IPCController } = require('./IPCController');
//@ts-ignore
const db = require('../db');
module.exports = class DatabaseController extends IPCController {
  constructor(ipcMain: any) {
    super(ipcMain);
  }
  addHandlers() {
    this.ipcMain.handle(
      'db:getOne',
      (e: Event, collection: string, id: number) => {
        return db.getOne(collection, id);
      }
    );

    this.ipcMain.handle('db:getAll', (e: Event, collection: string) => {
      return db.getAll(collection);
    });

    this.ipcMain.handle(
      'db:insert',
      (e: Event, collection: string, data: Object) => {
        db.insert(collection, data);
      }
    );

    this.ipcMain.handle(
      'db:delete',
      (e: Event, collection: string, id: number) => {
        db.delete(collection, id);
      }
    );

    this.ipcMain.handle(
      'db:update',
      (e: Event, collection: string, id: number, data: Object) => {
        db.update(collection, id, data);
      }
    );
  }
};
