import React from 'react';

interface PlaybackDebugProps {
  audioUrl: string;
  audioBlob: Blob | null;
  sending: boolean;
  setSending: (sending: boolean) => void;
  setTranscript: (transcript: string) => void;
}

const PlaybackDebug: React.FC<PlaybackDebugProps> = ({ audioUrl, audioBlob, sending, setSending, setTranscript }) => (
  <div style={{ marginTop: 24 }}>
    <h3>Playback (Debug)</h3>
    <audio controls src={audioUrl} />
    <div style={{ marginTop: 12 }}>
      <button
        onClick={async () => {
          if (!audioBlob) return;
          setSending(true);
          setTranscript('');
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
            setTranscript('Send failed: ' + (err as Error).message);
          }
          setSending(false);
        }}
        disabled={sending || !audioBlob}
        style={{ marginTop: 8 }}
      >
        {sending ? 'Sending...' : 'Send to Server'}
      </button>
    </div>
  </div>
);

export default PlaybackDebug;
