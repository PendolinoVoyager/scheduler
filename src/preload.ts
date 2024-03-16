const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('db', {
  getOne: (collection: string, id: number) =>
    ipcRenderer.invoke('db:getOne', collection, id),
  getAll: (collection: string) => ipcRenderer.invoke('db:getAll', collection),
  insert: (collection: string, data: any) =>
    ipcRenderer.invoke('db:insert', collection, data),
  delete: (collection: string, id: number) =>
    ipcRenderer.invoke('db:delete', collection, id),
  update: (collection: string, id: number, data: any) =>
    ipcRenderer.invoke('db:update', collection, id, data),
  find: (collection: string, query: any) =>
    ipcRenderer.invoke('db:find', collection, query),
  saveDatabase: () => ipcRenderer.invoke('db:saveDatabase'),
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
