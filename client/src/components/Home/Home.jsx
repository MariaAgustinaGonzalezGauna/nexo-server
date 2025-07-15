import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import homePeople from '../../assets/home-people.png';
import unstaLogo from '../../assets/unsta-logo.png';
import nexoLogoWhite from '../../assets/nexo-logo-white.png';
import EventCard from '../EventCard/EventCard';
import EventMapFull from '../EventMap/EventMapFull';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [userType, setUserType] = useState(null);
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/all');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar los eventos');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPreferencias = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.preferencias) {
          setPreferences(response.data.preferencias);
        }
        if (response.data && response.data.tipo !== undefined) {
          setUserType(response.data.tipo);
        }
      } catch (err) {
        setPreferences([]);
        setUserType(null);
      }
    };
    fetchPreferencias();
  }, []);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Ordenar eventos por la fecha del evento (dd/mm/aaaa), más próximo primero
  const sortedEvents = [...events].sort((a, b) => {
    if (a.fecha && b.fecha) {
      const [da, ma, ya] = a.fecha.split('/');
      const [db, mb, yb] = b.fecha.split('/');
      const dateA = new Date(`${ya}-${ma}-${da}`);
      const dateB = new Date(`${yb}-${mb}-${db}`);
      return dateA - dateB;
    }
    return 0;
  });

  // Filtrar eventos por nombre
  const filteredEvents = sortedEvents.filter(event =>
    event.nombre && event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar eventos por preferencias del usuario (primer carrusel)
  const preferredEvents = preferences.length > 0
    ? filteredEvents.filter(event => preferences.includes(event.tipo))
    : filteredEvents;

  // Carrusel de 'Explora más eventos': si filteredEvents está vacío, mostrar todos los eventos
  const exploreEvents = filteredEvents.length > 0 ? filteredEvents : sortedEvents;

  // Categorías únicas
  const categorias = Array.from(new Set(filteredEvents.map(event => event.tipo)));

  return (
    <div className="home">
      <section className="hero" style={isAuthenticated ? { minHeight: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' } : {}}>
        <div className="hero-content" style={isAuthenticated ? { width: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' } : {}}>
          {!isAuthenticated && (
            <h1>
              LA APP<br />DONDE TODO<br />SE JUNTA
            </h1>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button className="empezar-button" onClick={handleRegisterClick} style={{ display: isAuthenticated ? 'none' : 'inline-block' }}>EMPEZAR</button>
            {isAuthenticated && (userType === 1 || userType === 2) && (
              <button
                className="crear-evento-button"
                onClick={() => navigate('/barAccount')}
              >
                QUIERO AGREGAR UN EVENTO
              </button>
            )}
          </div>
        </div>
        {!isAuthenticated && (
          <div className="hero-image">
            <div className="phone-frame">
              <img src={homePeople} alt="NEXO community" className="phone-screen" />
              <div className="nexo-overlay">
                <img src={nexoLogoWhite} alt="NEXO" className="nexo-logo-overlay" />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="events-section">
        <div className="section-container">
          <h2>Enterate de los mejores eventos de tu ciudad</h2>
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
          {loading ? (
            <div className="loading">Cargando eventos...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">No hay eventos disponibles</div>
          ) : null}

          {/* Carrusel 1: Preferencias */}
          <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Eventos para vos</h3>
            {preferredEvents.length === 0 ? (
              <div className="no-events">No hay eventos de tus preferencias</div>
            ) : (
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
            )}
          </div>

          {/* Carrusel 2: Explora más eventos (reversa) */}
          <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Explora más eventos</h3>
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
              {[...exploreEvents].reverse().map(event => (
                <SwiperSlide key={event._id + '-reverse'}>
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

          {/* Carruseles por categoría */}
          {categorias.map((categoria) => (
            <div key={categoria} style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem'}}>{categoria}</h3>
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
                {filteredEvents.filter(event => event.tipo === categoria).map(event => (
                  <SwiperSlide key={event._id + '-cat'}>
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
          ))}
        </div>
      </section>

      {/* Mapa gigante de todos los eventos */}
      <EventMapFull events={sortedEvents} />

      <section className="about-section">
        <h2>Sobre nosotros</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Somos un grupo de jóvenes estudiantes de la UNSTA, con la idea de crear una app
              que conecte a las personas con planes reales. NEXO surge de la necesidad de
              encontrar eventos cercanos según los gustos personales, con una interfaz
              simple, moderna y pensada para que tanto usuarios como dueños de eventos
              puedan interactuar, descubrir y compartir experiencias. Nuestro objetivo
              es hacer que salir con amigos sea más fácil, organizado y divertido.
            </p>
          </div>
          <div className="logos">
            <img src={unstaLogo} alt="UNSTA Logo" className="unsta-logo" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 NEXO - Desarrollado por estudiantes de la UNSTA</p>
        <img src={nexoLogoWhite} alt="NEXO Logo" />
      </footer>
    </div>
  );
};

export default Home;
