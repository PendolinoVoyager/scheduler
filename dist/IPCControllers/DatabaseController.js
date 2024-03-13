"use strict";
// @ts-ignore
const { IPCController } = require('./IPCController');
//@ts-ignore
const db = require('../db');
module.exports = class DatabaseController extends IPCController {
    constructor(ipcMain) {
        super(ipcMain);
    }
    addHandlers() {
        this.ipcMain.handle('db:getOne', (e, collection, id) => {
            return db.getOne(collection, id);
        });
        this.ipcMain.handle('db:getAll', (e, collection) => {
            return db.getAll(collection);
        });
        this.ipcMain.handle('db:insert', (e, collection, data) => {
            db.insert(collection, data);
        });
        this.ipcMain.handle('db:delete', (e, collection, id) => {
            db.delete(collection, id);
        });
        this.ipcMain.handle('db:update', (e, collection, id, data) => {
            db.update(collection, id, data);
        });
    }
};
