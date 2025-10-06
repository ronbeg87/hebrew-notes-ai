import { useRef, useState } from 'react';
import { MicrophoneAudioSource } from './microphoneAudioSource';
import { WebWhisperTranscriber } from './webWhisperTranscriber';
import './App.css';

function App() {
  const [recording, setRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [transcribing, setTranscribing] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const audioSourceRef = useRef<MicrophoneAudioSource | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const transcriberRef = useRef<WebWhisperTranscriber>(new WebWhisperTranscriber());

  const handleStart = async () => {
    try {
      audioChunksRef.current = [];
      setAudioUrl(null);
      setTranscript('');
      
      if (!audioSourceRef.current) {
        audioSourceRef.current = new MicrophoneAudioSource();
      }
      
      audioSourceRef.current.onData((audioBuffer) => {
        setAudioStatus(`Recording... (${audioBuffer.length} samples)`);
        audioChunksRef.current.push(new Float32Array(audioBuffer));
      });
      
      await audioSourceRef.current.start();
      setRecording(true);
      setAudioStatus('Recording...');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setAudioStatus(`Error: ${(error as Error).message}`);
    }
  };

  const handleStop = async () => {
    try {
      if (audioSourceRef.current) {
        await audioSourceRef.current.stop();
      }
      setRecording(false);
      setAudioStatus('Processing...');

      // Convert Float32Array chunks to a single WAV Blob
      const allChunks = audioChunksRef.current;
      if (allChunks.length > 0) {
        const wavBlob = float32ToWavBlob(allChunks, 44100);
        setAudioUrl(URL.createObjectURL(wavBlob));
        setAudioStatus('Ready for transcription');

        // Auto-transcribe if API key is available
        if (apiKey.trim()) {
          setTranscribing(true);
          setAudioStatus('Transcribing...');
          transcriberRef.current.setApiKey(apiKey);
          const result = await transcriberRef.current.transcribe(wavBlob);
          setTranscript(result);
          setTranscribing(false);
          setAudioStatus('Transcription complete');
        }
      } else {
        setAudioStatus('No audio recorded');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setAudioStatus(`Error: ${(error as Error).message}`);
      setTranscribing(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioUrl || !apiKey.trim()) {
      alert('Please record audio and set your OpenAI API key first.');
      return;
    }

    setTranscribing(true);
    try {
      // Get the blob from the audio URL
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      
      transcriberRef.current.setApiKey(apiKey);
      const result = await transcriberRef.current.transcribe(audioBlob);
      setTranscript(result);
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscript(`[Transcription failed: ${(error as Error).message}]`);
    }
    setTranscribing(false);
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Hebrew Meeting Notes Web Client</h1>
      
      {/* Settings Panel */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3>Settings</h3>
          <button onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'Hide' : 'Show'}
          </button>
        </div>
        {showSettings && (
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              OpenAI API Key:
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  marginTop: '0.25rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </label>
            <small style={{ color: '#666' }}>
              Required for transcription. Your API key is stored locally and never sent anywhere except OpenAI.
            </small>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={handleStart} 
            disabled={recording}
            style={{ 
              marginRight: '0.5rem', 
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: recording ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: recording ? 'not-allowed' : 'pointer'
            }}
          >
            {recording ? 'Recording...' : 'Start Recording'}
          </button>
          <button 
            onClick={handleStop} 
            disabled={!recording}
            style={{ 
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: !recording ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !recording ? 'not-allowed' : 'pointer'
            }}
          >
            Stop Recording
          </button>
        </div>
        <div style={{ color: '#666' }}>Status: {audioStatus}</div>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>Recorded Audio</h3>
          <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '1rem' }} />
          <div>
            <button 
              onClick={handleTranscribe}
              disabled={transcribing || !apiKey.trim()}
              style={{ 
                marginRight: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: transcribing || !apiKey.trim() ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: transcribing || !apiKey.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {transcribing ? 'Transcribing...' : 'Transcribe'}
            </button>
            <button 
              onClick={downloadAudio}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download Audio
            </button>
          </div>
        </div>
      )}

      {/* Transcript */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Transcript</h3>
        {transcribing ? (
          <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            Transcribing...
          </div>
        ) : (
          <pre style={{ 
            textAlign: 'left', 
            whiteSpace: 'pre-wrap', 
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '100px',
            fontFamily: 'inherit'
          }}>
            {transcript || 'No transcript yet. Record audio and transcribe to see results here.'}
          </pre>
        )}
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
