import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GestorEventos.css';

const GestorEventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:5000';
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        console.log('No hay token, redirigiendo a login');
        navigate('/login');
        return;
      }

      console.log('Intentando obtener eventos...');
      const response = await axios.get(`${API_URL}/api/events/owner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Respuesta del servidor:', response.data);
      setEventos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener eventos:', err);
      setError(err.response?.data?.message || 'Error al cargar los eventos');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'aprobado':
        return 'estado-aprobado';
      case 'rechazado':
        return 'estado-rechazado';
      default:
        return '';
    }
  };

  const handleEdit = (id) => {
    navigate(`/barAccount/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchEventos();
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        setError('Error al eliminar el evento');
      }
    }
  };

  // Utilidad para convertir dd/mm/yyyy a Date
  function parseFecha(fechaStr) {
    if (!fechaStr) return null;
    const [dd, mm, yyyy] = fechaStr.split('/');
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  if (loading) {
    return <div className="loading">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gestor-eventos">
      <h1>{userType === '1' ? 'Gestión de Eventos' : 'Mis Eventos'}</h1>
      <div className="eventos-grid">
        {eventos.length === 0 ? (
          <p className="no-eventos">
            {userType === '1' ? 'No hay eventos para gestionar' : 'No has creado ningún evento aún'}
          </p>
        ) : (
          eventos.map((evento) => (
            <div key={evento._id} className="evento-card">
              <div className="evento-imagen">
                <img src={evento.imagenUrl} alt={evento.nombre} />
              </div>
              <div className="evento-info">
                <h3>{evento.nombre}</h3>
                <p className="evento-categoria"><strong>Categoría:</strong> {evento.tipo}</p>
                <p>{evento.descripcion}</p>
                <div className="evento-detalles">
                  <p><strong>Fecha:</strong> {parseFecha(evento.fecha) ? `${('0' + parseFecha(evento.fecha).getDate()).slice(-2)}/${('0' + (parseFecha(evento.fecha).getMonth() + 1)).slice(-2)}/${parseFecha(evento.fecha).getFullYear().toString().slice(-2)}` : ''}</p>
                  <p><strong>Hora:</strong> {evento.hora}</p>
                  <p><strong>Lugar:</strong> {evento.lugar}</p>
                  <p className={`estado ${getEstadoColor(evento.estado)}`}>
                    <strong>Estado:</strong> {evento.estado}
                  </p>
                  {userType === '2' && (
                    <p className="estado-info">
                      {evento.estado === 'pendiente' && 'Tu evento está siendo revisado por los administradores'}
                      {evento.estado === 'aprobado' && 'Tu evento ha sido aprobado y está visible para todos los usuarios'}
                      {evento.estado === 'rechazado' && 'Tu evento ha sido rechazado. Puedes editarlo y volver a enviarlo para revisión'}
                    </p>
                  )}
                </div>
                <div className="evento-acciones">
                  <button onClick={() => handleEdit(evento._id)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(evento._id)} className="btn-eliminar">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GestorEventos; 