import React from 'react';
import './EventCard.css';

const EventCard = ({ image, title, date, location }) => {
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={image} alt={title} />
      </div>
      <div className="event-info">
        <h3>{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-location">{location}</p>
        <button className="ver-mas">VER MÁS</button>
      </div>
    </div>
  );
};

export default EventCard; 