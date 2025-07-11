import React, { useEffect, useState } from 'react';
import CitySearch   from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList    from './components/EventList';
import { extractLocations, getEvents } from './api';

import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE,   setCurrentNOE]   = useState(32);
  const [events,       setEvents]       = useState([]);
  const [currentCity,  setCurrentCity]  = useState("See all cities");
  const [isLoading,    setIsLoading]    = useState(true);
  const [hasLoaded,    setHasLoaded]    = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    if (!hasLoaded) {
      setIsLoading(true);
    }
    
    const allEvents = await getEvents();
    if (!Array.isArray(allEvents)) {
      setIsLoading(false);
      return;
    }

    const filtered = currentCity === "See all cities"
      ? allEvents
      : allEvents.filter(ev => ev.location === currentCity);

    setEvents(filtered.slice(0, currentNOE));
    setAllLocations(extractLocations(allEvents));
    setIsLoading(false);
    setHasLoaded(true);
  };

  if (isLoading && !hasLoaded) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Meet is finding your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
      />
      <NumberOfEvents
        numberOfEvents={currentNOE}
        onNumberChange={val => setCurrentNOE(Number(val))}
      />
      <EventList events={events} />
    </div>
  );
};

export default App;