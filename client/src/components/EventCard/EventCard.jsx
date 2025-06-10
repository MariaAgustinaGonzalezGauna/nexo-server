import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';
import ShareButtonHome from '../ShareButton/shareButtonHome'; // si el share button está acá

const EventCard = ({ image, title, date, location, id }) => {
  const navigate = useNavigate();

  const handleVerMasClick = () => {
    navigate(`/evento/${id}`);
  };

  const link = `${window.location.origin}/evento/${id}`;

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={image} alt={title} />
      </div>
      <div className="event-info">
        <h3>{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-location">{location}</p>

        {/* Botón VER MÁS con navegación */}
        <button className="ver-mas" onClick={handleVerMasClick}>VER MÁS</button>

        {/* Botón de compartir */}
        <ShareButtonHome link={link} />
      </div>
    </div>
  );
};

export default EventCard;
