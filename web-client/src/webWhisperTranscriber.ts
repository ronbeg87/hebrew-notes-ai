import type { Transcriber } from './transcriber';

// Web-based transcriber using OpenAI Whisper API
export class WebWhisperTranscriber implements Transcriber {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    if (!this.apiKey) {
      return '[OpenAI API key not configured. Please set your API key to enable transcription.]';
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'he'); // Hebrew language code

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.text || '[No transcription received]';
    } catch (error) {
      console.error('Transcription error:', error);
      return `[Transcription failed: ${(error as Error).message}]`;
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}