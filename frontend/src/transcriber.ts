// Abstraction for STT (Speech-to-Text) transcribers
export interface Transcriber {
  transcribe(audioFilePath: string): Promise<string>;
}
