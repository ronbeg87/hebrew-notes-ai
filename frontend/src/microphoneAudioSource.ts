import type { AudioSource } from './audioSource';

export class MicrophoneAudioSource implements AudioSource {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private dataCallback: ((audioBuffer: Float32Array) => void) | null = null;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.processor.onaudioprocess = (e) => {
      if (this.dataCallback) {
        this.dataCallback(e.inputBuffer.getChannelData(0));
      }
    };
  }

  async stop() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  onData(callback: (audioBuffer: Float32Array) => void) {
    this.dataCallback = callback;
  }
}
