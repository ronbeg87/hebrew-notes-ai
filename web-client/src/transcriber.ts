// Abstraction for transcription engines
export interface Transcriber {
  transcribe(audioData: Blob | string): Promise<string>;
}