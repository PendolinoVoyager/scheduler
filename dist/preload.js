"use strict";
const { contextBridge, ipcRenderer } = require('electron/renderer');
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});
contextBridge.exposeInMainWorld('fs', {
    read: (name) => ipcRenderer.invoke('read', name),
});
