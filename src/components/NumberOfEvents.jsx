import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ numberOfEvents = 32, onNumberChange = () => {}, setErrorAlert = () => {} }) => {
  const [number, setNumber] = useState(numberOfEvents);

  useEffect(() => {
    setNumber(numberOfEvents);
  }, [numberOfEvents]);

  const handleChange = (e) => {
    const value = e.target.value;
    setNumber(value);
    
    if (isNaN(value) || value <= 0) {

      let errorText;
      if (isNaN(value)) {
        errorText = "Only positive numbers are allowed";
      } else if (value <= 0) {
        errorText = "Only positive numbers are allowed";
      }
      setErrorAlert(errorText);
    } else {

      setErrorAlert("");
      onNumberChange(value);
    }
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