import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';

const AdminEventos = () => {
  const { estado } = useParams();
  const [eventos, setEventos] = useState({
    pendientes: [],
    aprobados: [],
    rechazados: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      await axiosInstance.put(`/admin/events/${eventId}/approve`);
      const nuevosEventos = await cargarEventos();
      if (nuevosEventos) {
        // Si no hay más eventos pendientes, navegar a aprobados
        if (nuevosEventos.pendientes.length === 0) {
          navigate('/admin/eventos/aprobados');
        }
      }
    } catch (error) {
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
      await axiosInstance.put(`/admin/events/${eventId}/reject`, { motivoRechazo: '' });
      const nuevosEventos = await cargarEventos();
      if (nuevosEventos) {
        // Si no hay más eventos pendientes, navegar a rechazados
        if (nuevosEventos.pendientes.length === 0) {
          navigate('/admin/eventos/rechazados');
        }
      }
    } catch (error) {
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
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center text-gray-600 py-4 bg-gray-50 rounded-lg">
          No hay eventos {type}
        </div>
      ) : (
        events.map(evento => (
          <div key={evento._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">
                  {evento.nombre}
                </h3>
                <p className="mt-2 text-gray-600">{evento.descripcion}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Fecha: {evento.fecha} - Hora: {evento.hora}</p>
                  <p>Lugar: {evento.lugar}</p>
                  <p>Tipo: {evento.tipo}</p>
                  <p>Dueño: {evento.duenioId?.nombre || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {type === 'pendientes' && (
                  <>
                    <button
                      onClick={() => handleApprove(evento._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(evento._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {type === 'aprobados' && (
                  <button
                    onClick={() => handleEdit(evento._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Panel de Administración de Eventos
        </h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Menú de navegación */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={`/admin/eventos/${item.id}`}
              className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors text-center
                ${estado === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs
                ${estado === item.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}>
                {item.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Lista de eventos del estado seleccionado */}
        <EventList 
          events={eventos[estado] || []} 
          type={estado}
        />
      </div>
    </div>
  );
};

export default AdminEventos; 