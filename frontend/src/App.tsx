
import { useRef, useState } from 'react';
import { MicrophoneAudioSource } from './microphoneAudioSource';
import { WhisperCppTranscriber } from './whisperCppTranscriber';


function App() {
  const [recording, setRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [transcribing, setTranscribing] = useState(false);
  const [saveLocally, setSaveLocally] = useState(false);
  const audioSourceRef = useRef<MicrophoneAudioSource | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);

  const handleStart = async () => {
    audioChunksRef.current = [];
    setAudioUrl(null);
    if (!audioSourceRef.current) {
      audioSourceRef.current = new MicrophoneAudioSource();
      audioSourceRef.current.onData((audioBuffer) => {
        // For MVP, just show that audio is being received
        setAudioStatus(`Receiving audio (${audioBuffer.length} samples)`);
        // Store audio for playback
        audioChunksRef.current.push(new Float32Array(audioBuffer));
      });
    } else {
      audioSourceRef.current.onData((audioBuffer) => {
        setAudioStatus(`Receiving audio (${audioBuffer.length} samples)`);
        audioChunksRef.current.push(new Float32Array(audioBuffer));
      });
    }
    await audioSourceRef.current.start();
    setRecording(true);
    setAudioStatus('Recording...');
  };

  const handleStop = async () => {
    if (audioSourceRef.current) {
      await audioSourceRef.current.stop();
    }
    setRecording(false);
    setAudioStatus('Stopped');

    // Convert Float32Array chunks to a single WAV Blob for playback
    const allChunks = audioChunksRef.current;
    if (allChunks.length > 0) {
      const wavBlob = float32ToWavBlob(allChunks, 44100); // 44.1kHz default
      setAudioUrl(URL.createObjectURL(wavBlob));

      // Optionally save the file locally
      if (saveLocally) {
        // Use Electron's save dialog and file system
        if (window.electronAPI && typeof window.electronAPI.saveFile === 'function') {
          try {
            const arrayBuffer = await wavBlob.arrayBuffer();
            await window.electronAPI.saveFile(arrayBuffer, 'recording.wav');
          } catch (err) {
            // Optionally show error to user
            alert('Failed to save file locally: ' + (err as Error).message);
          }
        } else {
          alert('Local file saving is not implemented in the preload script.');
        }
      }

      // Save the blob to a temp file and transcribe
      setTranscribing(true);
      setTranscript('');
      try {
        // Save blob to a temp file using Electron's file system (via preload/main process)
        // This requires a preload API to save the file and return the path
        if (window.electronAPI && typeof window.electronAPI.saveTempFile === 'function') {
          const arrayBuffer = await wavBlob.arrayBuffer();
          const filePath = await window.electronAPI.saveTempFile(arrayBuffer);
          const whisper = new WhisperCppTranscriber();
          const result = await whisper.transcribe(filePath);
          setTranscript(result);
        } else {
          setTranscript('Transcription integration with file system is not yet implemented.');
        }
      } catch (err) {
        setTranscript('Transcription failed: ' + (err as Error).message);
      }
      setTranscribing(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Hebrew Meeting Assistant</h1>
      <div style={{ margin: '2rem 0' }}>
        <button onClick={handleStart} disabled={recording} style={{ marginRight: 8 }}>
          Start Recording
        </button>
        <button onClick={handleStop} disabled={!recording}>
          Stop Recording
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={saveLocally}
            onChange={e => setSaveLocally(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Save file locally after recording
        </label>
      </div>
      <div>Status: {audioStatus}</div>
      {audioUrl && (
        <div style={{ marginTop: 24 }}>
          <h3>Playback (Debug)</h3>
          <audio controls src={audioUrl} />
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <h3>Transcript</h3>
        {transcribing ? <div>Transcribing...</div> : <pre style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{transcript}</pre>}
      </div>
    </div>
  );
}

// Helper: Convert Float32Array chunks to WAV Blob
function float32ToWavBlob(chunks: Float32Array[], sampleRate: number): Blob {
  // Flatten all chunks
  const length = chunks.reduce((acc, arr) => acc + arr.length, 0);
  const buffer = new Float32Array(length);
  let offset = 0;
  for (const arr of chunks) {
    buffer.set(arr, offset);
    offset += arr.length;
  }
  // Convert to 16-bit PCM
  const pcm = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    let s = Math.max(-1, Math.min(1, buffer[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  // WAV header
  const wavBuffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(wavBuffer);
  // RIFF identifier 'RIFF'
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, 1, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, 'data');
  view.setUint32(40, pcm.length * 2, true);
  // PCM samples
  let idx = 44;
  for (let i = 0; i < pcm.length; i++, idx += 2) {
    view.setInt16(idx, pcm[i], true);
  }
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export default App;