// src/components/NumberOfEvents.jsx
import React from 'react';

const NumberOfEvents = ({ numberOfEvents, onNumberChange }) => {
  return (
    <div id="number-of-events">
      <input
        type="text"
        role="textbox"
        className="number"
        value={numberOfEvents}
        onChange={(e) => onNumberChange(e.target.value)}
      />
    </div>
  );
};

export default NumberOfEvents;
