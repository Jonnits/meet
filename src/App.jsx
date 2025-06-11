// src/App.jsx
import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('all');
  const [numberOfEvents, setNumberOfEvents] = useState(32);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEvents = await getEvents();
      setAllEvents(fetchedEvents);
      setLocations(extractLocations(fetchedEvents));
      setEvents(fetchedEvents.slice(0, numberOfEvents));
    };
    fetchData();
  }, [numberOfEvents]);

  const updateEvents = (location) => {
    setCurrentLocation(location);
    const filtered =
      location === 'See all cities'
        ? allEvents
        : allEvents.filter((event) => event.location === location);
    setEvents(filtered.slice(0, numberOfEvents));
  };

  const handleNumberChange = (value) => {
    const count = parseInt(value) || 0;
    setNumberOfEvents(count);
    const filtered =
      currentLocation === 'all' || currentLocation === 'See all cities'
        ? allEvents
        : allEvents.filter((event) => event.location === currentLocation);
    setEvents(filtered.slice(0, count));
  };

  return (
    <div>
      <CitySearch allLocations={locations} onLocationSelect={updateEvents} />
      <NumberOfEvents numberOfEvents={numberOfEvents} onNumberChange={handleNumberChange} />
      <EventList events={events} />
    </div>
  );
};

export default App;
