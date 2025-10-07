import { Transcriber } from "./Transcriber";
import { Buffer } from "buffer";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises";
import { exec } from "child_process";

export class WhisperTranscriber implements Transcriber {
  async transcribe(audioBuffer: Buffer): Promise<string> {
    const ts = Date.now();
    const baseFilename = `recording-${ts}`;
    const tempAudioPath = join("./", `${baseFilename}.wav`);
    const tempOutputPath = join("./", `${baseFilename}.txt`);
    await writeFile(tempAudioPath, audioBuffer);
    const whisperCmd = `whisper \"${tempAudioPath}\" --language he -f txt --fp16 False`;
    console.log("Executing command:", whisperCmd);
    const transcript = await new Promise<string>((resolve, reject) => {
      exec(
        whisperCmd,
        {
          cwd: process.cwd(),
          env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        },
        async (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Whisper failed: ${stderr || error.message}`));
            return;
          }
          try {
            const result = await readFile(tempOutputPath, "utf8");
            resolve(result);
          } catch (err) {
            reject(
              new Error(
                "Failed to read Whisper output: " + (err as Error).message
              )
            );
          } finally {
            await unlink(tempAudioPath).catch(() => {});
            await unlink(tempOutputPath).catch(() => {});
          }
        }
      );
    });
    return transcript;
  }
}
