import React, { useState } from 'react';
import Spinner from './Spinner';


// This component handles transcription of recorded audio
interface TranscribeAudioProps {
  audioUrl: string;
  audioBlob: Blob | null;
  setTranscript: (transcript: string) => void;
  transcript: string;
  setNotes: (notes: string) => void;
}

const TranscribeAudio: React.FC<TranscribeAudioProps> = ({ audioUrl, audioBlob, setTranscript, transcript, setNotes }) => {
  // Handler for generating notes
  const [spinnerLabel, setSpinnerLabel] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const isLoading = isTranscribing || isGeneratingNotes;

  const handleGenerateNotes = async () => {
    if (!transcript) return;
    setIsGeneratingNotes(true);
    setSpinnerLabel('Generating notes...');
    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }
      const data = await response.json();
      setNotes(data.notes || 'No notes received.');
    } catch (err) {
      setNotes('Notes generation failed: ' + (err as Error).message);
    }
    setIsGeneratingNotes(false);
  };
  // Handler for transcribing audio
  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setSpinnerLabel('Transcribing...');
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
    setIsTranscribing(false);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Transcribe Audio</h3>
      <audio controls src={audioUrl} />
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <button
          onClick={handleTranscribe}
          disabled={isLoading || !audioBlob}
          style={{ marginTop: 8 }}
        >
          {isLoading ? 'Transcribing...' : 'Transcribe'}
        </button>
        <button
          type="button"
          disabled={!transcript || isLoading}
          style={{ marginTop: 8 }}
          onClick={handleGenerateNotes}
        >
          Generate Notes
        </button>
      </div>
      {/* Reserve space for transcript/spinner to prevent layout flicker */}
      <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', marginTop: 16 }}>
        {isLoading ? <Spinner label={spinnerLabel} /> : null}
        {/* Transcript will be shown by parent, but reserve space here to avoid flicker */}
      </div>
    </div>
  );
};

export default TranscribeAudio;
