import React, { useEffect, useState } from "react"
import "./EventView.css"
import { useParams, useNavigate } from "react-router-dom"
import ShareButton from "../ShareButton/shareButton"
import axiosInstance from "../../config/axios"

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
        } else {
          setError('Hubo un error al cargar el evento. Por favor, intenta de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerEvento();
  }, [id]);

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
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="error-container">
        <h2>Evento no encontrado</h2>
        <p>No pudimos encontrar el evento que estás buscando.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="event-info-container">
        <div className="imagenes">
          <img src={evento.imagenUrl} alt={evento.nombre} width={"400px"} height={"400px"} />
        </div>
        <div className="info">
          <h2>{evento.nombre}</h2>
          <h3>{evento.lugar}</h3>
          <p>{evento.fecha} - {evento.hora}</p>
          <div className="exp">
            <ShareButton link={window.location.href} />
            <div className="puntuacion">
              <p>☆</p>
              <p>☆</p>
              <p>☆</p>
              <p>☆</p>
              <p>☆</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mapa-desc">
        <div className="maps">
          *
        </div>
        <div className="desc">
          <h2>Descripción</h2>
          <p>{evento.descripcion}</p>
          <div className="info-adicional">
            <h3>Información Adicional</h3>
            <p>{evento.informacion}</p>
            <p>Tipo de evento: {evento.tipo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;