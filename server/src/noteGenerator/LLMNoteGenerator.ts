import { GPTClient, LLMClient } from "../llm";
import { NoteGenerator } from "./NoteGenerator";

export class LLMNoteGenerator implements NoteGenerator {
  private llmClient: LLMClient = new GPTClient(
    process.env.AZURE_GPT_API_KEY || ""
  );
  async generateNotes(text: string): Promise<string> {
    const summary = await this.llmClient.summarize(text);
    return summary || "No summary available.";
  }
}
