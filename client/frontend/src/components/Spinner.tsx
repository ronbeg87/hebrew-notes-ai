import React from 'react';

const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <span
      style={{
        display: 'inline-block',
        width: 24,
        height: 24,
        border: '3px solid #ccc',
        borderTop: '3px solid #333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        verticalAlign: 'middle',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    {label && <span style={{ marginLeft: 12 }}>{label}</span>}
  </div>
);

export default Spinner;
