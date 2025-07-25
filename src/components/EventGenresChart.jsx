import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);
  
  const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
  
  // Step 1: Add the colors array with 5 colors for each genre (blue/purple theme)
  const colors = ['#1E3A8A', '#3B82F6', '#8B5CF6', '#A855F7', '#6366F1'];

  useEffect(() => {
    const getData = () => {
      return genres.map(genre => {
        const filteredEvents = events.filter(event => event.summary && event.summary.includes(genre));
        return {
          name: genre,
          value: filteredEvents.length
        };
      });
    };
    
    if (events && Array.isArray(events) && events.length > 0) {
      setData(getData());
    }
  }, [events, events?.length]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;
    return percent ? (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend 
          verticalAlign="bottom" 
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;