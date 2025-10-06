import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('whisper', {
  transcribe: (audioFilePath: string) => ipcRenderer.invoke('whisper-transcribe', audioFilePath),
});
