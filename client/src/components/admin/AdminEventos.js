import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import './AdminEventos.css';

const AdminEventos = () => {
  const { estado } = useParams();
  const [eventos, setEventos] = useState({
    pendientes: [],
    aprobados: [],
    rechazados: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingButtons, setLoadingButtons] = useState(new Set()); // Estado para botones individuales
  const navigate = useNavigate();

  // Validar que el estado en la URL sea válido
  useEffect(() => {
    const estadosValidos = ['pendientes', 'aprobados', 'rechazados'];
    if (!estadosValidos.includes(estado)) {
      navigate('/admin/eventos/pendientes', { replace: true });
    }
  }, [estado, navigate]);

  const cargarEventos = async () => {
    try {
      const response = await axiosInstance.get('/admin/events');
      console.log('Eventos cargados:', response.data);
      setEventos(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/admin/login', { replace: true });
      } else {
        setError('Error al cargar los eventos');
      }
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (!token || userType !== '1') {
        localStorage.clear();
        navigate('/admin/login', { replace: true });
        return false;
      }
      return true;
    };

    const iniciarCarga = async () => {
      if (!checkAuth()) return;
      await cargarEventos();
      setLoading(false);
    };

    iniciarCarga();
  }, [navigate]);

  const handleApprove = async (eventId) => {
    try {
      // Marcar botón como cargando
      setLoadingButtons(prev => new Set(prev).add(eventId));
      
      await axiosInstance.put(`/admin/events/${eventId}/approve`);
      
      // Actualizar el estado local inmediatamente
      setEventos(prevEventos => {
        const eventoAprobado = prevEventos.pendientes.find(e => e._id === eventId);
        if (!eventoAprobado) return prevEventos;
        
        return {
          pendientes: prevEventos.pendientes.filter(e => e._id !== eventId),
          aprobados: [...prevEventos.aprobados, eventoAprobado],
          rechazados: prevEventos.rechazados
        };
      });
      
      // Remover botón del estado de carga
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      // Recargar datos del servidor en segundo plano para sincronizar
      setTimeout(() => {
        cargarEventos();
      }, 100);
      
    } catch (error) {
      // Remover botón del estado de carga en caso de error
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/admin/login', { replace: true });
      } else {
        setError('Error al aprobar el evento');
      }
    }
  };

  const handleReject = async (eventId) => {
    try {
      // Marcar botón como cargando
      setLoadingButtons(prev => new Set(prev).add(eventId));
      
      await axiosInstance.put(`/admin/events/${eventId}/reject`, { motivoRechazo: '' });
      
      // Actualizar el estado local inmediatamente
      setEventos(prevEventos => {
        const eventoRechazado = prevEventos.pendientes.find(e => e._id === eventId);
        if (!eventoRechazado) return prevEventos;
        
        return {
          pendientes: prevEventos.pendientes.filter(e => e._id !== eventId),
          aprobados: prevEventos.aprobados,
          rechazados: [...prevEventos.rechazados, eventoRechazado]
        };
      });
      
      // Remover botón del estado de carga
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      // Recargar datos del servidor en segundo plano para sincronizar
      setTimeout(() => {
        cargarEventos();
      }, 100);
      
    } catch (error) {
      // Remover botón del estado de carga en caso de error
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/admin/login', { replace: true });
      } else {
        setError('Error al rechazar el evento');
      }
    }
  };

  const handleEdit = async (eventId) => {
    navigate(`/admin/eventos/${eventId}/editar`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando eventos...</div>
      </div>
    );
  }

  const EventList = ({ events, type }) => (
    <div className="event-list-container">
      {events.length === 0 ? (
        <div className="text-center text-gray-600 py-4 bg-gray-50 rounded-lg">
          No hay eventos {type}
        </div>
      ) : (
        events.map(evento => (
          <div key={evento._id} className="event-card">
            <div className="event-image">
              <img 
                src={evento.imagenUrl} 
                alt={evento.nombre}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Sin+Imagen';
                }}
              />
            </div>
            <div className="event-details">
              <h3 className="event-title">
                {evento.nombre}
              </h3>
              <p className="event-description">{evento.descripcion}</p>
              {evento.informacion && (
                <p className="event-adicional"><b>Información adicional:</b> {evento.informacion}</p>
              )}
              <div className="event-meta">
                <p>Fecha: {evento.fecha} - Hora: {evento.hora}</p>
                <p>Lugar: {evento.lugar}</p>
                <p>Tipo: {evento.tipo}</p>
                <p>Dueño: {evento.entidad?.nombre || 'No especificado'}</p>
              </div>
            </div>
            <div className="event-actions">
              {type === 'pendientes' && (
                <>
                  <button
                    onClick={() => handleApprove(evento._id)}
                    className="action-button"
                    disabled={loadingButtons.has(evento._id)}
                  >
                    {loadingButtons.has(evento._id) ? 'Aprobiando...' : 'Aprobar'}
                  </button>
                  <button
                    onClick={() => handleReject(evento._id)}
                    className="action-button"
                    disabled={loadingButtons.has(evento._id)}
                  >
                    {loadingButtons.has(evento._id) ? 'Rechazando...' : 'Rechazar'}
                  </button>
                </>
              )}
              {type === 'rechazados' && (
                <button
                  onClick={() => handleApprove(evento._id)}
                  className="action-button"
                  disabled={loadingButtons.has(evento._id)}
                >
                  {loadingButtons.has(evento._id) ? 'Aceptando...' : 'Aceptar'}
                </button>
              )}
              {type === 'aprobados' && (
                <button
                    onClick={() => handleReject(evento._id)}
                    className="action-button"
                    disabled={loadingButtons.has(evento._id)}
                  >
                    {loadingButtons.has(evento._id) ? 'Rechazando...' : 'Rechazar'}
                  </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const menuItems = [
    { id: 'pendientes', label: 'Pendientes', count: eventos.pendientes?.length || 0 },
    { id: 'aprobados', label: 'Aprobados', count: eventos.aprobados?.length || 0 },
    { id: 'rechazados', label: 'Rechazados', count: eventos.rechazados?.length || 0 }
  ];

  // Debug
  console.log('Estado actual:', estado);
  console.log('Eventos disponibles:', eventos);
  console.log('Eventos a mostrar:', eventos[estado]);

  return (
    <div className="admin-events-layout">
      {/* Sidebar para los botones de estado */}
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">Gestión de Eventos</h2>
        <div className="flex flex-col space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={`/admin/eventos/${item.id}`}
              className={`admin-sidebar-link ${estado === item.id ? 'active' : ''}`}
            >
              {item.label} 
              <span className={`admin-badge ${estado === item.id ? 'active' : ''}`}>
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenido principal de eventos */}
      <div className="admin-main-content">
        <h1 className="admin-main-title">
          Panel de Administración de Eventos
        </h1>
        
        {error && (
          <div className="error-message">
            <p className="error-message-text">{error}</p>
          </div>
        )}

        {/* La lista de eventos se mantiene aquí */}
        <EventList 
          events={eventos[estado] || []} 
          type={estado}
        />
      </div>
    </div>
  );
};

export default AdminEventos; 