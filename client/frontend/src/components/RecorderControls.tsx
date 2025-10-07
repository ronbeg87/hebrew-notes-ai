import React from 'react';

interface RecorderControlsProps {
  recording: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecorderControls: React.FC<RecorderControlsProps> = ({ recording, onStart, onStop }) => (
  <div style={{ margin: '2rem 0' }}>
    <button onClick={onStart} disabled={recording} style={{ marginRight: 8 }}>
      Start Recording
    </button>
    <button onClick={onStop} disabled={!recording}>
      Stop Recording
    </button>
  </div>
);

export default RecorderControls;
