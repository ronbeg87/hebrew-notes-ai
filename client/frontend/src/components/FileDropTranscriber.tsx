import React, { useState } from 'react';

interface FileDropTranscriberProps {
  setTranscript: (transcript: string) => void;
  setStatus?: (status: string) => void;
  setDroppedFile: (file: File | null) => void;
  droppedFile: File | null;
}

const FileDropTranscriber: React.FC<FileDropTranscriberProps> = ({ setTranscript, setStatus, setDroppedFile, droppedFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setDroppedFile(file);
      setStatus?.(`File ready: ${file.name}`);
      setTranscript('');
    }
  };

  return (
    <div
  onDragEnter={handleDragEnter}
  onDragLeave={handleDragLeave}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
      style={{
        border: dragActive ? '2px solid #7c3aed' : '2px dashed #a78bfa',
        borderRadius: 10,
        padding: 28,
        margin: '18px 0',
        background: dragActive ? '#4c1d95' : '#2e1065',
        textAlign: 'center',
        color: dragActive ? '#f3e8ff' : '#c4b5fd',
        fontWeight: dragActive ? 600 : 400,
        cursor: dragActive ? 'pointer' : 'default',
        transition: 'background 0.2s, color 0.2s, border 0.2s, font-weight 0.2s, box-shadow 0.2s',
        boxShadow: dragActive ? '0 2px 12px #7c3aed44' : 'none',
      }}
    >
      {droppedFile
        ? (
            <>
              {`File ready: ${droppedFile.name}`}
              <br />
              <button
                type="button"
                style={{
                  marginTop: 12,
                  padding: '6px 16px',
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500,
                  boxShadow: '0 1px 4px #0002',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setDroppedFile(null);
                  setStatus?.('Idle');
                  setTranscript('');
                }}
              >Remove file</button>
            </>
          )
        : 'Drag & drop a WAV/MP3 recording file here to transcribe'}
    </div>
  );
};

export default FileDropTranscriber;
