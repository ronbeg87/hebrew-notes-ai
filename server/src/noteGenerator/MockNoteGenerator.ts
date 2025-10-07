import { NoteGenerator } from "./NoteGenerator";

export class MockNoteGenerator implements NoteGenerator {
  async generateNotes(text: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `Mock notes for transcript: ${
      text
        ? text.slice(0, 40) + (text.length > 40 ? "..." : "")
        : "No transcript provided."
    }`;
  }
}
