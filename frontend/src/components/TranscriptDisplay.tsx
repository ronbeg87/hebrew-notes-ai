import React from 'react';

interface TranscriptDisplayProps {
  transcribing: boolean;
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcribing, transcript }) => (
  <div style={{ marginTop: 24 }}>
    <h3>Transcript</h3>
    {transcribing ? <div>Transcribing...</div> : <pre style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{transcript}</pre>}
  </div>
);

export default TranscriptDisplay;
