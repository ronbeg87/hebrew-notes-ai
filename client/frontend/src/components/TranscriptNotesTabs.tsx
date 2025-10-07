import React, { useState } from 'react';

interface TranscriptNotesTabsProps {
  transcript: string;
  notes: string;
}

const tabStyle = {
  padding: '8px 24px',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  color: '#c4b5fd',
  fontWeight: 600,
  fontSize: 16,
  borderBottom: '2px solid transparent',
  transition: 'color 0.2s, border-bottom 0.2s',
  outline: 'none',
};

const activeTabStyle = {
  ...tabStyle,
  color: '#f3e8ff',
  borderBottom: '2px solid #7c3aed',
};

const TranscriptNotesTabs: React.FC<TranscriptNotesTabsProps> = ({ transcript, notes }) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'notes'>('transcript');

  return (
    <div style={{ marginTop: 24, width: '100%' }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #3b2f5c', marginBottom: 12, width: '100%' }}>
        <button
          style={activeTab === 'transcript' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('transcript')}
        >
          Transcript
        </button>
        <button
          style={activeTab === 'notes' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>
      <div style={{
        minHeight: 80,
        color: '#f3e8ff',
        whiteSpace: 'pre-wrap',
        background: '#2e1065',
        borderRadius: 8,
        padding: 16,
        width: '100%',
        boxSizing: 'border-box',
        direction: 'rtl',
        textAlign: 'right',
      }}>
        {activeTab === 'transcript' ? transcript || 'No transcript yet.' : notes || 'No notes yet.'}
      </div>
    </div>
  );
};

export default TranscriptNotesTabs;
