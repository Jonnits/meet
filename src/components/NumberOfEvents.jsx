import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ numberOfEvents = 32, onNumberChange = () => {} }) => {
  const [number, setNumber] = useState(numberOfEvents);

  useEffect(() => {
    setNumber(numberOfEvents);
  }, [numberOfEvents]);

  const handleChange = (e) => {
    const value = e.target.value;
    setNumber(value);
    onNumberChange(value);
  };

  return (
    <div id="number-of-events">
      <input
        type="text"
        role="textbox"
        className="number"
        value={number}
        onChange={handleChange}
      />
    </div>
  );
};

export default NumberOfEvents;
