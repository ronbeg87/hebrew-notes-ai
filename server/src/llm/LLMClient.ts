import { AzureOpenAI } from "openai";

// LLMClient interface and base class for GPT or other LLMs
export interface LLMClient {
  summarize(text: string): Promise<string | null>;
}

export class GPTClient implements LLMClient {
  private endpoint: string =
    "https://begr-mb118lt5-swedencentral.cognitiveservices.azure.com/";
  private modelName: string = "gpt-4.1";
  private deployment: string = "gpt-4.1";
  private apiVersion: string = "2024-04-01-preview";
  private client: AzureOpenAI;

  constructor(apiKey: string) {
    const options = {
      endpoint: this.endpoint,
      apiKey: apiKey,
      deployment: this.deployment,
      apiVersion: this.apiVersion,
    };
    this.client = new AzureOpenAI(options);
  }

  async summarize(text: string): Promise<string | null> {
    const instructions = `You are a helpful assistant that generates concise, well-structured notes from meeting transcripts in Hebrew. Focus on key points, decisions, and action items. Use bullet points for clarity.`;
    const transcriptTaskMessage = `Here is the meeting transcript, Please generate the notes:\n\n${text}`;

    const response = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: transcriptTaskMessage },
      ],
      max_completion_tokens: 5000,
      temperature: 0,
      top_p: 0.8,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: this.modelName,
    });

    return response.choices[0].message.content;
  }
}
