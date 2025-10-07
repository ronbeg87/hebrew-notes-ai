import { Transcriber } from "./Transcriber";
import { Buffer } from "buffer";

export class MockTranscriber implements Transcriber {
  async transcribe(audioBuffer: Buffer): Promise<string> {
    return "This is a mock transcript.";
  }
}
