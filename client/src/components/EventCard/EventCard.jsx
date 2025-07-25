import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';
import ShareButtonHome from '../ShareButton/shareButtonHome';
import StarDisplay from '../Stars/StarDisplay';

const EventCard = ({ image, title, date, location, descripcion, id }) => {
  const navegacion = useNavigate();
  const ruta = `/evento/${id}`;
  const link = `${window.location.origin}${ruta}`;
  
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={image} alt={title} />
      </div>
      <div className="event-info">
        <h3>{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-location">{location}</p>
        
        {/* Sistema de estrellas */}
        <div className="event-rating">
          <StarDisplay eventoId={id} showCount={true} size="medium-large" />
        </div>

        <button 
          className="ver-mas" 
          onClick={() => navegacion(ruta)}
        >
          VER MÁS
        </button>

        {/* Botón de compartir */}
        <ShareButtonHome link={link} />
      </div>
    </div>
  );
};

export default EventCard;