import { Buffer } from "buffer";

export interface Transcriber {
  transcribe(audioBuffer: Buffer): Promise<string>;
}
