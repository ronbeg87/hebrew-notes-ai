import React from 'react';
import Spinner from './Spinner';


// This component handles transcription of recorded audio
interface TranscribeAudioProps {
  audioUrl: string;
  audioBlob: Blob | null;
  sending: boolean;
  setSending: (sending: boolean) => void;
  setTranscript: (transcript: string) => void;
}




const TranscribeAudio: React.FC<TranscribeAudioProps> = ({ audioUrl, audioBlob, sending, setSending, setTranscript }) => {
  // Handler for transcribing audio
  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      const response = await fetch('http://localhost:3001/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }
      const data = await response.json();
      setTranscript(data.transcript || 'No transcript received.');
    } catch (err) {
      setTranscript('Transcription failed: ' + (err as Error).message);
    }
    setSending(false);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Transcribe Audio</h3>
      <audio controls src={audioUrl} />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleTranscribe}
          disabled={sending || !audioBlob}
          style={{ marginTop: 8 }}
        >
          {sending ? 'Transcribing...' : 'Transcribe'}
        </button>
      </div>
      {/* Reserve space for transcript/spinner to prevent layout flicker */}
      <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', marginTop: 16 }}>
        {sending ? <Spinner label="Transcribing..." /> : null}
        {/* Transcript will be shown by parent, but reserve space here to avoid flicker */}
      </div>
    </div>
  );
};

export default TranscribeAudio;
