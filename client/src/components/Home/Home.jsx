import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import homePeople from '../../assets/home-people.png';
import unstaLogo from '../../assets/unsta-logo.png';
import nexoLogoWhite from '../../assets/nexo-logo-white.png';
import EventCard from '../EventCard/EventCard';

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

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            LA APP<br />DONDE TODO<br />SE JUNTA
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button className="empezar-button" onClick={handleRegisterClick}>EMPEZAR</button>
            <button
              style={{ background: 'none', border: 'none', color: '#ffa726', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '1rem' }}
              onClick={() => navigate('/barAccount')}
            >
                QUIERO AGREGAR UN EVENTO
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="phone-frame">
            <img src={homePeople} alt="NEXO community" className="phone-screen" />
            <div className="nexo-overlay">
              <img src={nexoLogoWhite} alt="NEXO" className="nexo-logo-overlay" />
            </div>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="section-container">
          <h2>Enterate de los mejores eventos de tu ciudad</h2>
          {loading ? (
            <div className="loading">Cargando eventos...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : events.length === 0 ? (
            <div className="no-events">No hay eventos disponibles</div>
          ) : (
            <div className="events-grid">
              {[0, 1].map((rowIndex) => (
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
                  {getCarouselItems(rowIndex).map((event, index) => (
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
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
