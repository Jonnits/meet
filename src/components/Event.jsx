// src/components/Event.jsx
import React, { useState } from 'react';


const Event = ({event}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className="event">
        <h2>{event.summary}</h2>
        <p>{new Date(event.created).toString()}</p>
        <p>{event.location}</p>
        {
            showDetails && (
                <div className="event-details">
                    <p>{event.description}</p>
                    <p>
                        <a href={event.htmlLink} target="_blank" rel="noreferrer">
                            View on Google Calendar
                        </a>
                    </p>
                    <p>Starts: {new Date(event.start.dateTime).toString()}</p>
                    <p>Ends: {new Date(event.end.dateTime).toString()}</p>
                </div>
            )
        }
        <button className="details-btn" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
    </li>
  );
};


export default Event;