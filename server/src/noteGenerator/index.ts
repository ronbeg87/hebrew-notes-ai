import { NoteGenerator } from "./NoteGenerator";
import { MockNoteGenerator } from "./MockNoteGenerator";
import { LLMNoteGenerator } from "./LLMNoteGenerator";

export function getNoteGenerator(
  engine: "mock" | "llm" = "mock"
): NoteGenerator {
  switch (engine) {
    case "mock":
    default:
      return new MockNoteGenerator();
    case "llm":
      return new LLMNoteGenerator();
  }
}

export async function generateNotesFromText(
  text: string,
  engine: "mock" = "mock"
): Promise<string> {
  const noteGenerator = getNoteGenerator(engine);
  return await noteGenerator.generateNotes(text);
}
