export interface NoteGenerator {
  generateNotes(text: string): Promise<string>;
}
