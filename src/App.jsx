import React, { useEffect, useState } from 'react';
import CitySearch   from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList    from './components/EventList';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

import './App.css';
import CityEventsChart from './components/CityEventsChart';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE,   setCurrentNOE]   = useState(32);
  const [events,       setEvents]       = useState([]);
  const [currentCity,  setCurrentCity]  = useState("See all cities");
  const [isLoading,    setIsLoading]    = useState(true);
  const [hasLoaded,    setHasLoaded]    = useState(false);
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    if (navigator.onLine) {
      setWarningAlert("");
    } else {
      setWarningAlert("You are offline. The displayed events may not be up to date.");
    }
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
      <h1>Meet App</h1>
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
      </div>
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert} 
      />
      <NumberOfEvents
        numberOfEvents={currentNOE}
        onNumberChange={val => setCurrentNOE(Number(val))}
        setErrorAlert={setErrorAlert}
      />
      <CityEventsChart allLocations={allLocations}
      events={events} />
      <EventList events={events} />
    </div>
  );
};

export default App;