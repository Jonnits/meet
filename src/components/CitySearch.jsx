import React, { useState } from 'react';

const CitySearch = ({ allLocations = [], setCurrentCity }) => {
  const [query, setQuery]           = useState('');
  const [showSuggestions, setShow]  = useState(false);
  const [suggestions, setSugs]      = useState(allLocations);

  const buildSuggestions = value => {
    if (value.trim() === '') return allLocations;
    return allLocations.filter(loc =>
      loc.toUpperCase().includes(value.toUpperCase())
    );
  };

  const handleInputChange = e => {
    const value = e.target.value;
    setQuery(value);
    setSugs(buildSuggestions(value));
    if (value.trim() === '') {
      setCurrentCity('See all cities');
    }
  };

  const handleFocus = () => {
    setSugs(buildSuggestions(query));
    setShow(true);
  };

  const handleItemClick = e => {
    const value = e.target.textContent;
    setQuery(value === 'See all cities' ? '' : value);
    setCurrentCity(value);
    setShow(false);
  };

  return (
    <div id="city-search">
      <input
        className="city"
        type="text"
        placeholder="Search for a city"
        value={query}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setShow(false), 100)}
        onChange={handleInputChange}
      />

      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map(loc => (
            <li key={loc} onClick={handleItemClick}>
              {loc}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClick}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
