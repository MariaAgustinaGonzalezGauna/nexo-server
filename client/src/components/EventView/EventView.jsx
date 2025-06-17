import React, { useEffect, useState } from "react";
import "./EventView.css";
import { useParams, useNavigate } from "react-router-dom";
import ShareButton from "../ShareButton/shareButton";
import axiosInstance from "../../config/axios";
import StarRate from "../Stars/starRate";

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="info">
            <h2>{evento.nombre}</h2>
            <h3>{evento.lugar}</h3>
            <p>{evento.fecha} - {evento.hora}</p>
            <div className="exp">
              <ShareButton link={window.location.href} />
              <div className="puntuacion">
                <StarRate />
              </div>
            </div>
          </div>
          <div className="desc">
              <h2>Descripción</h2>
              <p>{evento.descripcion}</p>
            </div>
        </div>
      </div>

      <div className="comentarios">
        <textarea placeholder="Dejá tu comentario..." />
        <button type="button">Enviar</button>
      </div>
    </div>
  );
};

export default EventView;