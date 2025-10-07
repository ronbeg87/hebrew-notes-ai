// Abstraction for audio sources
export interface AudioSource {
  start(): Promise<void>;
  stop(): Promise<void>;
  onData(callback: (audioBuffer: Float32Array) => void): void;
}
