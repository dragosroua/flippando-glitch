import React, { useState } from 'react';

function GameLevels({ options, value, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value);

  function handleSelectChange(event) {
    const selectedValue = parseInt(event.target.value);
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  }

  return (
    <select value={selectedValue} onChange={handleSelectChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default GameLevels;