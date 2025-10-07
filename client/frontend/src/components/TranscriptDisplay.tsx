import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => (
  <div style={{ marginTop: 24 }}>
    <h3>Transcript</h3>
    <pre style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{transcript}</pre>
  </div>
);

export default TranscriptDisplay;
