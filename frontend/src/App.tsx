
import { useRef, useState } from 'react';
import { MicrophoneAudioSource } from './microphoneAudioSource';
import { WhisperCppTranscriber } from './whisperCppTranscriber';
import RecorderControls from './components/RecorderControls';
import SaveLocallyCheckbox from './components/SaveLocallyCheckbox';
import PlaybackDebug from './components/PlaybackDebug';
import TranscriptDisplay from './components/TranscriptDisplay';
import { float32ToWavBlob } from './helpers/float32ToWavBlob';
import { appBackground, card, title, status } from './App.styles';


function App() {
  const [recording, setRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Idle');
  const [sending, setSending] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
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
      setAudioBlob(wavBlob);

      // Optionally save the file locally
      if (saveLocally) {
        // Use Electron's save dialog and file system
        if (window.electronAPI && typeof window.electronAPI.saveFile === 'function') {
          try {
            const arrayBuffer = await wavBlob.arrayBuffer();
            await window.electronAPI.saveFile(arrayBuffer, 'recording.wav');
          } catch (err) {
            alert('Failed to save file locally: ' + (err as Error).message);
          }
        } else if ('showSaveFilePicker' in window) {
          // Browser File System Access API
          try {
            // @ts-ignore
            const handle = await window.showSaveFilePicker({
              suggestedName: 'recording.wav',
              types: [{
                description: 'WAV audio',
                accept: { 'audio/wav': ['.wav'] }
              }]
            });
            const writable = await handle.createWritable();
            await writable.write(wavBlob);
            await writable.close();
            alert('File saved successfully.');
          } catch (err) {
            alert('Failed to save file: ' + (err as Error).message);
          }
        } else {
          // Fallback: download via anchor
          const a = document.createElement('a');
          a.href = URL.createObjectURL(wavBlob);
          a.download = 'recording.wav';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          alert('File download started.');
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
    <div style={appBackground}>
      <div style={card}>
        <h1 style={title}>Hebrew Meeting Assistant</h1>
        <RecorderControls
          recording={recording}
          onStart={handleStart}
          onStop={handleStop}
        />
        <SaveLocallyCheckbox
          checked={saveLocally}
          onChange={setSaveLocally}
        />
        <div style={status}>Status: {audioStatus}</div>
        {audioUrl && (
          <PlaybackDebug
            audioUrl={audioUrl}
            audioBlob={audioBlob}
            sending={sending}
            setSending={setSending}
            setTranscript={setTranscript}
          />
        )}
        <TranscriptDisplay
          transcribing={transcribing}
          transcript={transcript}
        />
      </div>
    </div>
  );
}

export default App;