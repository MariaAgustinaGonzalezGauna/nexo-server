import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'react-dom';
import { useNavigate } from "react-router";
import './EventPage.css';


const EventPage = () => {
  const navegacion = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = window.localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events/preferences', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar los eventos');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Cargando eventos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-page-container">
      <button onClick={() => navegacion('/Preferences')} className="preferences-button">Ir a Mis Preferencias</button>
      <h1>Eventos Disponibles</h1>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="evento-card">
            <img src={event.imagenUrl} alt={event.nombre} />
            <h5>{event.nombre}</h5>
            <p>{event.lugar}</p>
            <p className="event-date">{event.fecha}</p>
            <button onClick={()=> navegacion(`/evento/${event._id}`)}>Ver más</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;