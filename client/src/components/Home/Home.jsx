import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import homePeople from '../../assets/home-people.png';
import unstaLogo from '../../assets/unsta-logo.png';
import nexoLogoWhite from '../../assets/nexo-logo-white.png';
import EventCard from '../EventCard/EventCard';
import EventMapFull from '../EventMap/EventMapFull';

const Home = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState({ 0: false, 1: false });
  const [isAnimating, setIsAnimating] = useState({ 0: true, 1: true });
  const dragStartX = useRef({ 0: 0, 1: 0 });
  const [positions, setPositions] = useState({ 0: 0, 1: -50 });
  const rowRefs = useRef([]);
  const lastDragPosition = useRef({ 0: 0, 1: -50 });
  const animationFrameId = useRef({ 0: null, 1: null });
  const lastTime = useRef({ 0: null, 1: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [userType, setUserType] = useState(null);

  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Intentando obtener eventos...');
        const response = await axios.get('http://localhost:5000/api/events/all');
        console.log('Respuesta:', response.data);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message || 'Error al cargar los eventos');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Si el usuario está autenticado, obtener sus preferencias y tipo
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

  useEffect(() => {
    const animateRow = (rowIndex, timestamp) => {
      if (!lastTime.current[rowIndex]) lastTime.current[rowIndex] = timestamp;
      const deltaTime = timestamp - lastTime.current[rowIndex];

      const row = rowRefs.current[rowIndex];
      if (!isDragging[rowIndex] && isAnimating[rowIndex] && row && !row.matches(':hover')) {
        setPositions(prev => {
          const speed = 0.0004;
          let newPos = prev[rowIndex];

          if (rowIndex === 0) {
            newPos = prev[0] - speed * deltaTime;
            if (newPos <= -100) newPos = 0;
          } else {
            newPos = prev[1] + speed * deltaTime;
            if (newPos >= 50) newPos = -50;
          }

          return {
            ...prev,
            [rowIndex]: newPos
          };
        });
      }

      lastTime.current[rowIndex] = timestamp;
      animationFrameId.current[rowIndex] = requestAnimationFrame((time) => animateRow(rowIndex, time));
    };

    [0, 1].forEach(rowIndex => {
      animationFrameId.current[rowIndex] = requestAnimationFrame((time) => animateRow(rowIndex, time));
    });

    return () => {
      [0, 1].forEach(rowIndex => {
        if (animationFrameId.current[rowIndex]) {
          cancelAnimationFrame(animationFrameId.current[rowIndex]);
        }
      });
    };
  }, [isDragging, isAnimating]);

  const handleMouseDown = (e, rowIndex) => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [rowIndex]: true }));
    setIsAnimating(prev => ({ ...prev, [rowIndex]: false }));

    const row = rowRefs.current[rowIndex];
    if (!row) return;

    dragStartX.current[rowIndex] = e.clientX;
    lastDragPosition.current[rowIndex] = positions[rowIndex];

    row.style.cursor = 'grabbing';
    row.style.userSelect = 'none';
  };

  const handleMouseMove = (e, rowIndex) => {
    if (!isDragging[rowIndex]) return;

    const row = rowRefs.current[rowIndex];
    if (!row) return;

    e.preventDefault();
    const x = e.clientX;
    const walk = (x - dragStartX.current[rowIndex]) * 0.4;
    const baseTranslate = lastDragPosition.current[rowIndex];
    const newTranslate = baseTranslate + (walk / row.offsetWidth) * 100;
    const limitedTranslate = Math.min(Math.max(newTranslate, -100), 0);

    setPositions(prev => ({ ...prev, [rowIndex]: limitedTranslate }));
  };

  const handleMouseUp = (rowIndex) => {
    if (!isDragging[rowIndex]) return;

    setIsDragging(prev => ({ ...prev, [rowIndex]: false }));
    setIsAnimating(prev => ({ ...prev, [rowIndex]: true }));

    const row = rowRefs.current[rowIndex];
    if (!row) return;

    row.style.cursor = 'grab';
    row.style.removeProperty('user-select');
    lastTime.current[rowIndex] = null;
  };

  const handleMouseLeave = (rowIndex) => {
    if (isDragging[rowIndex]) {
      handleMouseUp(rowIndex);
    }
  };

  const getCarouselItems = (rowIndex) => {
    const items = [...events, ...events];
    return rowIndex === 1 ? items.reverse() : items;
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Ordenar eventos por la fecha del evento (dd/mm/aaaa), más próximo primero
  const sortedEvents = [...events].sort((a, b) => {
    if (a.fecha && b.fecha) {
      // Convertir de dd/mm/aaaa a yyyy-mm-dd para comparar
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

  // Lógica para carrusel infinito en todos los carruseles
  useEffect(() => {
    [0, 1, ...Array.from(new Set(filteredEvents.map(event => event.tipo))).map((_, idx) => idx + 2)].forEach(rowIndex => {
      const row = rowRefs.current[rowIndex];
      if (!row) return;
      let totalItems = 0;
      if (rowIndex === 0) {
        totalItems = preferredEvents.length * 2;
      } else if (rowIndex === 1) {
        totalItems = exploreEvents.length * 2;
      } else {
        const categoria = Array.from(new Set(filteredEvents.map(event => event.tipo)))[rowIndex - 2];
        totalItems = filteredEvents.filter(event => event.tipo === categoria).length * 2;
      }
      if (totalItems === 0) return;
      if (positions[rowIndex] <= -100) {
        setPositions(prev => ({ ...prev, [rowIndex]: 0 }));
      } else if (positions[rowIndex] >= 0) {
        setPositions(prev => ({ ...prev, [rowIndex]: -100 }));
      }
    });
  }, [positions, preferredEvents.length, exploreEvents.length, filteredEvents]);

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
          {/* Primer carrusel: preferencias o todos */}
          <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Eventos para vos</h3>
            <div className="events-grid">
              {[0].map((rowIndex) => (
                <div
                  key={rowIndex}
                  ref={el => rowRefs.current[rowIndex] = el}
                  className={`carousel-row ${isDragging[rowIndex] ? 'dragging' : ''}`}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex)}
                  onMouseMove={(e) => handleMouseMove(e, rowIndex)}
                  onMouseUp={() => handleMouseUp(rowIndex)}
                  onMouseLeave={() => handleMouseLeave(rowIndex)}
                  style={{
                    transform: `translateX(${positions[rowIndex]}%)`,
                    transition: isDragging[rowIndex] ? 'none' : 'transform 0.3s ease'
                  }}
                >
                  {preferredEvents.length === 0 ? (
                    <div className="no-events">No hay eventos de tus preferencias</div>
                  ) : (
                    preferredEvents.concat(preferredEvents).map((event, index) => (
                      <div
                        key={`${event._id}-${index}-${rowIndex}`}
                        className="event-item"
                      >
                        <EventCard
                          id={event._id}
                          image={event.imagenUrl}
                          title={event.nombre}
                          date={event.fecha}
                          location={event.lugar}
                          descripcion={event.descripcion}
                        />
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Segundo carrusel: todos los eventos en reversa */}
          <div style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem'}}>Explora más eventos</h3>
            <div className="events-grid" style={{ marginTop: '0' }}>
              <div
                ref={el => rowRefs.current[1] = el}
                className={`carousel-row ${isDragging[1] ? 'dragging' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, 1)}
                onMouseMove={(e) => handleMouseMove(e, 1)}
                onMouseUp={() => handleMouseUp(1)}
                onMouseLeave={() => handleMouseLeave(1)}
                style={{
                  transform: `translateX(${positions[1]}%)`,
                  transition: isDragging[1] ? 'none' : 'transform 0.3s ease'
                }}
              >
                {[...exploreEvents].reverse().concat([...exploreEvents].reverse()).map((event, index) => (
                  <div
                    key={`${event._id}-reverse-${index}`}
                    className="event-item"
                  >
                    <EventCard
                      id={event._id}
                      image={event.imagenUrl}
                      title={event.nombre}
                      date={event.fecha}
                      location={event.lugar}
                      descripcion={event.descripcion}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Carruseles por categoría */}
          {Array.from(new Set(filteredEvents.map(event => event.tipo)))
            .map((categoria, idx) => (
            <div key={categoria} style={{border: '2px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem'}}>{categoria}</h3>
              <div className="events-grid">
                <div
                  ref={el => rowRefs.current[idx + 2] = el}
                  className="carousel-row"
                  style={{
                    transform: `translateX(${positions[idx + 2] || 0}%)`,
                    transition: isDragging[idx + 2] ? 'none' : 'transform 0.3s ease'
                  }}
                >
                  {filteredEvents.filter(event => event.tipo === categoria).concat(filteredEvents.filter(event => event.tipo === categoria)).map((event, index) => (
                    <div
                      key={`${event._id}-cat-${index}`}
                      className="event-item"
                    >
                      <EventCard
                        id={event._id}
                        image={event.imagenUrl}
                        title={event.nombre}
                        date={event.fecha}
                        location={event.lugar}
                        descripcion={event.descripcion}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
