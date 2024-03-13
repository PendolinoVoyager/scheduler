"use strict";
const { contextBridge, ipcRenderer } = require('electron/renderer');
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});
contextBridge.exposeInMainWorld('db', {
    getOne: (collection, id) => ipcRenderer.invoke('db:getOne', collection, id),
    getAll: (collection) => ipcRenderer.invoke('db:getAll', collection),
    insert: (collection, data) => ipcRenderer.invoke('db:insert', collection, data),
    delete: (collection, id) => ipcRenderer.invoke('db:delete', collection, id),
    update: (collection, id, data) => ipcRenderer.invoke('db:update', collection, id),
});
contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system'),
});
