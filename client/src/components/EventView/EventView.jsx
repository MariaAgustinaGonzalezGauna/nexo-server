import React, { useEffect, useState } from "react";
import "./EventView.css";
import { useParams, useNavigate } from "react-router-dom";
import ShareButton from "../ShareButton/shareButton";
import axiosInstance from "../../config/axios";
import StarRate from "../Stars/starRate";
import CommentSection from "../Comments/Comments";
import EventMapMini from '../EventMap/EventMapMini';

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        console.log('Obteniendo evento con ID:', id);
        const response = await axiosInstance.get(`/events/event/${id}`);
        console.log('Respuesta del servidor:', response.data);
        setEvento(response.data);
      } catch (error) {
        console.error('Error al obtener el evento:', error);
        if (error.response?.status === 404) {
          setError('El evento no fue encontrado');
          // Si querés redirigir:
          // navigate("/404"); 
        } else {
          setError('Hubo un error al cargar el evento. Por favor, intenta de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerEvento();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenedor">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <div className="event-info-container">
        <div className="imagenes">
          <img src={evento.imagenUrl} alt={evento.nombre} />
        </div>
        <div className="info-desc">
          <h2>{evento.nombre}</h2>
          <div className="event-date">{evento.fecha} - {evento.hora}</div>
          <div className="event-location">{evento.lugar}</div>
          <div className="event-description">{evento.descripcion}</div>
          <div className="exp">
            <span className="share-btn"><ShareButton link={window.location.href} /></span>
            <div className="puntuacion">
              <StarRate />
            </div>
          </div>
        </div>
      </div>
      {/* Mapa mini y comentarios en filas separadas de la grilla */}
      {evento.lat && evento.lng && (
        <div className="event-map-mini-container">
          <EventMapMini lat={evento.lat} lng={evento.lng} nombre={evento.nombre} eventId={evento._id} />
        </div>
      )}
      <CommentSection eventoId={evento._id} />
    </div>
  );
};

export default EventView;