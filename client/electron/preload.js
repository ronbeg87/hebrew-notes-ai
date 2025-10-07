const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (buffer, defaultFileName) => ipcRenderer.invoke('save-file', buffer, defaultFileName),
});

contextBridge.exposeInMainWorld('whisper', {
  transcribe: (filePath, options) => ipcRenderer.invoke('whisper-transcribe', filePath, options),
});