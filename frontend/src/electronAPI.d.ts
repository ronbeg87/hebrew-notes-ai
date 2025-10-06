// TypeScript declaration for window.electronAPI
export interface ElectronAPI {
  saveTempFile(buffer: ArrayBuffer): Promise<string>;
  /**
   * Save a file to a user-selected location using a save dialog.
   * @param buffer The file data as an ArrayBuffer
   * @param defaultFileName The default file name to suggest
   */
  saveFile(buffer: ArrayBuffer, defaultFileName: string): Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
