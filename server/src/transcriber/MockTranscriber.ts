import { Transcriber } from "./Transcriber";
import { Buffer } from "buffer";

export class MockTranscriber implements Transcriber {
  async transcribe(audioBuffer: Buffer): Promise<string> {
    // Simulate a delay for the transcription process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "This is a mock transcript.";
  }
}
