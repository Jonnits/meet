import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = () => {
      return allLocations.map((location) => {
        const count = events.filter((event) => event.location === location).length;
        const city = location.split(/, | - /)[0];
        return { city, count };
      });
    };
    
    if (allLocations && events && allLocations.length > 0) {
      setData(getData());
    }
  }, [allLocations, events]); 

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 80,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="category" dataKey="city" name="City" angle={45} interval={0} tick={{ dx: 15, dy: 30, fontSize: 14 }} />
        <YAxis type="number" dataKey="count" name="Number of Events" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Events by City" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;