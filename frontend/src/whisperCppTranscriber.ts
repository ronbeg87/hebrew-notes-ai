import type { Transcriber } from './transcriber';

// Calls the Electron preload bridge to run whisper.cpp on a given audio file path
export class WhisperCppTranscriber implements Transcriber {
  async transcribe(audioFilePath: string): Promise<string> {
    if (window.whisper && typeof window.whisper.transcribe === 'function') {
      return await window.whisper.transcribe(audioFilePath);
    }
    return '[Transcription bridge not available]';
  }
}
