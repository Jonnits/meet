// src/App.jsx
import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList from './components/EventList';
import { extractLocations, getEvents } from './api';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations]       = useState([]);
  const [currentCity,  setCurrentCity]        = useState('See all cities');
  const [currentNOE,   setCurrentNOE]         = useState(32);
  const [events,       setEvents]             = useState([]);

  useEffect(() => {
    const fetchAndFilter = async () => {
      const allEvents = await getEvents();
      if (!Array.isArray(allEvents)) return;

      const filtered = 
        currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter(e => e.location === currentCity);

      setEvents(filtered.slice(0, currentNOE));

      setAllLocations(extractLocations(allEvents));
    };

    fetchAndFilter();
  }, [currentCity, currentNOE]);

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
