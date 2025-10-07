// TypeScript declaration for window.whisper
export interface WhisperAPI {
  transcribe(audioFilePath: string): Promise<string>;
}

declare global {
  interface Window {
    whisper: WhisperAPI;
  }
}
