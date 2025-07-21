import React, { useEffect, useState } from 'react';
import CitySearch   from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList    from './components/EventList';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

import './App.css';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
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

    if (navigator.onLine) {
      setWarningAlert("");
    } else {
      setWarningAlert("You are offline. The displayed events may not be up to date.");
    }
    fetchData();
  }, [currentCity, currentNOE, hasLoaded]);

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
      <img src="/meet-title-icon.png" alt="Meet logo" />
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
      <div 
        className="charts-container"
        style={{
          display: 'grid',
          gridTemplateColumns: windowWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '20px',
          margin: '40px 0',
          width: '100%'
        }}
      >
        <div style={{
          width: '100%',
          height: '450px',
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '8px',
          padding: '15px',
          boxSizing: 'border-box'
        }}>
          <CityEventsChart allLocations={allLocations} events={events} />
        </div>
        <div style={{
          width: '100%',
          height: '450px',
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '8px',
          padding: '15px',
          boxSizing: 'border-box'
        }}>
          <EventGenresChart events={events} />
        </div>
      </div>
      <EventList events={events} />
    </div>
  );
};

export default App;