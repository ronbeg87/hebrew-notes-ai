import { Transcriber } from "./Transcriber";
import { MockTranscriber } from "./MockTranscriber";
import { WhisperTranscriber } from "./WhisperTranscriber";

export function getTranscriber(
  engine: "whisper" | "mock" = "whisper"
): Transcriber {
  switch (engine) {
    case "mock":
      return new MockTranscriber();
    case "whisper":
    default:
      return new WhisperTranscriber();
  }
}

export async function transcribeAudioBuffer(
  audioBuffer: Buffer,
  engine: "whisper" | "mock" = "whisper"
): Promise<string> {
  const transcriber = getTranscriber(engine);
  return await transcriber.transcribe(audioBuffer);
}
