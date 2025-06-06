import React from 'react';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';

const App = () => {
  return (
    <div>
      <CitySearch />
      <EventList />
    </div>
  );
}


export default App;