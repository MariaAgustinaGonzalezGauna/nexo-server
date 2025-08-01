import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Preferences.css';
//cambio de prueba
// Importar imágenes de eventos
import gastronomiaImg from '../../assets/eventos/cine.png';
import socialImg from '../../assets/eventos/happy-hour.png';
import musicalImg from '../../assets/eventos/musica-vivo.png';
import teatroImg from '../../assets/eventos/teatro.png';
import cineImg from '../../assets/eventos/cine.png';
import deportivoImg from '../../assets/eventos/cine.png';
import recreativoImg from '../../assets/eventos/cine.png';
import data from '../../config/data';


const Preferences = () => {
  const navigate = useNavigate();
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    // Obtener preferencias guardadas del usuario
    const fetchPreferences = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const response = await axios.get(`${data.url}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.preferencias && response.data.preferencias.length > 0) {
          // Si viene de login o registro, redirigir a EventPage
          if (window.history.state && window.history.state.usr && window.history.state.usr.fromAuth) {
            navigate('/EventPage', { replace: true });
          } else {
            setSelectedPreferences(response.data.preferencias);
          }
        } else if (response.data && response.data.preferencias) {
          setSelectedPreferences(response.data.preferencias);
        }
      } catch (err) {
        setSelectedPreferences([]);
      }
    };
    fetchPreferences();
  }, [navigate]);

  const tiposEventos = [
    { id: 1, nombre: 'Gastronomia', imagen: gastronomiaImg },
    { id: 2, nombre: 'Social', imagen: socialImg },
    { id: 3, nombre: 'Musical', imagen: musicalImg },
    { id: 4, nombre: 'Teatro', imagen: teatroImg },
    { id: 5, nombre: 'Cine', imagen: cineImg },
    { id: 6, nombre: 'Deportivo', imagen: deportivoImg },
    { id: 7, nombre: 'Recreativo', imagen: recreativoImg }
  ];

  const toggleSelection = (nombre) => {
    setSelectedPreferences(prev => 
      prev.includes(nombre)
        ? prev.filter(item => item !== nombre)
        : [...prev, nombre]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.put(`${data.url}/api/users/${userId}/preferences`, 
        {
          preferences: selectedPreferences
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate('/EventPage', { replace: true });
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      navigate('/EventPage', { replace: true });
    }
  };

  const handleSkip = () => {
    // Navigate to EventPage when skipping
    navigate('/EventPage', { replace: true });
  };

  const renderPreferenceSection = (title, items) => (
    <div className="preference-section">
      <h2>{title}</h2>
      <div className="preference-grid">
        {items.map(item => (
          <div
            key={item.id}
            className={`preference-item ${selectedPreferences.includes(item.nombre) ? 'selected' : ''}`}
            onClick={() => toggleSelection(item.nombre)}
          >
            <div className="preference-image-container">
              <img src={item.imagen} alt={item.nombre} />
              {selectedPreferences.includes(item.nombre) && (
                <div className="selected-overlay">
                  <span className="checkmark">✓</span>
                </div>
              )}
            </div>
            <p>{item.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <div className="header-text">
          <div className="title-container">
            <h1>QUEREMOS<br />SABER DE<br />VOS</h1>
            <h2>SELECCIONA TUS FAVORITOS</h2>
          </div>
        </div>
        <div className="preferences-actions">
          <button className="continue-button" onClick={handleSubmit}>CONTINUAR</button>
          <button className="skip-button" onClick={handleSkip}>OMITIR</button>
        </div>
      </div>
      <div className="preferences-content">
        {renderPreferenceSection('Tus tipos de eventos favoritos', tiposEventos)}
      </div>
    </div>
  );
};

export default Preferences; 