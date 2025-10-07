import React from 'react';

interface SaveLocallyCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SaveLocallyCheckbox: React.FC<SaveLocallyCheckboxProps> = ({ checked, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginRight: 6 }}
      />
      Save file locally after recording
    </label>
  </div>
);

export default SaveLocallyCheckbox;
