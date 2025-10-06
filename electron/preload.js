const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveTempFile: (buffer) => ipcRenderer.invoke('save-temp-file', buffer),
  saveFile: (buffer, defaultFileName) => ipcRenderer.invoke('save-file', buffer, defaultFileName),
});
