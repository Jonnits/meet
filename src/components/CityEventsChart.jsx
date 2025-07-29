import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
    
    if (allLocations && events && Array.isArray(allLocations) && Array.isArray(events)) {
      setData(getData());
    }
  }, [allLocations, events]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis 
          type="category" 
          dataKey="city" 
          name="City"
          angle={60}
          textAnchor="start"
          height={100}
          tick={{ fontSize: 12, fill: '#cbd5e1' }}
        />
        <YAxis 
          type="number" 
          dataKey="count" 
          name="Number of Events"
          tick={{ fontSize: 12, fill: '#cbd5e1' }}
          label={{ value: 'Number of Events', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '4px',
            color: '#f1f5f9'
          }}
        />
        <Scatter 
          data={data} 
          fill="#3b82f6"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;