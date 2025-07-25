import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EventPage.css';
import EventCard from '../EventCard/EventCard';
import EventMapFull from '../EventMap/EventMapFull';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const EventPage = () => {
  const navegacion = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
   const [userType, setUserType] = useState(null);
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
  try {
    const token = window.localStorage.getItem('token');
    const userId = window.localStorage.getItem('userId');
    // Obtener todos los eventos
    const responseAll = await axios.get('http://localhost:5000/api/events/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAllEvents(responseAll.data);

    // Obtener usuario
    const responseUser = await axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('DATOS DEL USUARIO:', responseUser.data);  
    if (responseUser.data) {
      if (responseUser.data.preferencias) {
        setPreferences(responseUser.data.preferencias);
      }
     setUserType(responseUser.data.tipo);// 👈 aquí guardas tipo de usuario
    }
    
    setLoading(false);
  } catch (err) {
    setError(err.message || 'Error al cargar los eventos');
    setLoading(false);
  }
};
    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando eventos...</div>;
  if (error) return <div className="error">{error}</div>;

  // Filtrar eventos por nombre
  const filteredEvents = allEvents.filter(event =>
    event.nombre && event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eventos de preferencias
  const preferredEvents = preferences.length > 0
    ? filteredEvents.filter(event => preferences.includes(event.tipo))
    : [];

  // Resto de eventos
  const otherEvents = filteredEvents.filter(event =>
    !preferences.includes(event.tipo)
  );

  // Mensaje cuando no hay eventos
  if (allEvents.length === 0) {
    return (
      <div className="event-page-container">
        <h1>Eventos Disponibles</h1>
        <div className="no-events-message">
          No hay eventos disponibles en este momento.
        </div>
      </div>
    );
  }

  return (
    <div className="event-page-container">
      <div className='boton-container'>
            {isAuthenticated && userType === 2 && (
  <button
    className="crear-evento-boton"
    onClick={() => navigate('/barAccount')}
  >
    QUIERO AGREGAR UN EVENTO
  </button>
)}

          </div>
      <h1>Eventos Disponibles</h1>
      <input
        type="text"
        placeholder="Buscar evento por nombre..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="event-search-input"
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '1rem auto',
          display: 'block',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
      />
      {/* Carruseles dobles solo si el buscador está vacío */}
      {searchTerm.trim() === '' ? (
        <>
          {preferredEvents.length > 0 && (
            <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Eventos según tus preferencias</h3>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={800}
                loop={true}
                breakpoints={{
                  1200: { slidesPerView: 3 },
                  900: { slidesPerView: 2 },
                  0: { slidesPerView: 1 }
                }}
                style={{ padding: '1rem 0' }}
              >
                {preferredEvents.map(event => (
                  <SwiperSlide key={event._id}>
                    <EventCard
                      id={event._id}
                      image={event.imagenUrl}
                      title={event.nombre}
                      date={event.fecha}
                      location={event.lugar}
                      descripcion={event.descripcion}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {preferredEvents.length === 0 && preferences.length > 0 && (
            <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Eventos según tus preferencias</h3>
              <p style={{textAlign: 'center', color: '#666', margin: '2rem 0'}}>No hay eventos disponibles según tus preferencias actuales.</p>
            </div>
          )}
          {otherEvents.length > 0 && (
            <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Otros eventos</h3>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={800}
                loop={true}
                breakpoints={{
                  1200: { slidesPerView: 3 },
                  900: { slidesPerView: 2 },
                  0: { slidesPerView: 1 }
                }}
                style={{ padding: '1rem 0' }}
              >
                {otherEvents.map(event => (
                  <SwiperSlide key={event._id}>
                    <EventCard
                      id={event._id}
                      image={event.imagenUrl}
                      title={event.nombre}
                      date={event.fecha}
                      location={event.lugar}
                      descripcion={event.descripcion}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {otherEvents.length === 0 && preferredEvents.length === 0 && (
            <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Todos los eventos</h3>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={800}
                loop={true}
                breakpoints={{
                  1200: { slidesPerView: 3 },
                  900: { slidesPerView: 2 },
                  0: { slidesPerView: 1 }
                }}
                style={{ padding: '1rem 0' }}
              >
                {filteredEvents.map(event => (
                  <SwiperSlide key={event._id}>
                    <EventCard
                      id={event._id}
                      image={event.imagenUrl}
                      title={event.nombre}
                      date={event.fecha}
                      location={event.lugar}
                      descripcion={event.descripcion}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </>
      ) : (
        // Carrusel único si hay búsqueda
        filteredEvents.length > 0 && (
          <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Eventos</h3>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={800}
              loop={true}
              breakpoints={{
                1200: { slidesPerView: 3 },
                900: { slidesPerView: 2 },
                0: { slidesPerView: 1 }
              }}
              style={{ padding: '1rem 0' }}
            >
              {filteredEvents.map(event => (
                <SwiperSlide key={event._id}>
                  <EventCard
                    id={event._id}
                    image={event.imagenUrl}
                    title={event.nombre}
                    date={event.fecha}
                    location={event.lugar}
                    descripcion={event.descripcion}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )
      )}
      {/* Mapa de eventos */}
      <EventMapFull events={filteredEvents} />
    </div>
  );
};

export default EventPage;