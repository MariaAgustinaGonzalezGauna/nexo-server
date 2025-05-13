import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Preferences.css';

// Importar imágenes de eventos
import musicaImg from '../../assets/eventos/musica-vivo.png';
import teatroImg from '../../assets/eventos/teatro.png';
import cineImg from '../../assets/eventos/cine.png';
import happyHourImg from '../../assets/eventos/happy-hour.png';

// Importar imágenes de ambientes
import tranquilosImg from '../../assets/ambientes/tranquilos.png';
import fiestasImg from '../../assets/ambientes/fiestas.png';
import aireLibreImg from '../../assets/ambientes/aire-libre.png';
import recitalesImg from '../../assets/ambientes/recitales.png';

// Importar imágenes de momentos
import mananaImg from '../../assets/momentos/manana.png';
import nochesImg from '../../assets/momentos/noches.png';
import entreSemanaImg from '../../assets/momentos/entre-semana.png';
import finesSemanaImg from '../../assets/momentos/fines-semana.png';

const Preferences = () => {
  const navigate = useNavigate();
  const [selectedPreferences, setSelectedPreferences] = useState({
    eventos: [],
    ambientes: [],
    momentos: []
  });

  const tiposEventos = [
    { id: 1, nombre: 'Música en vivo', imagen: musicaImg },
    { id: 2, nombre: 'Teatro', imagen: teatroImg },
    { id: 3, nombre: 'Cine', imagen: cineImg },
    { id: 4, nombre: 'Happy hour', imagen: happyHourImg }
  ];

  const tiposAmbientes = [
    { id: 5, nombre: 'Tranquilos', imagen: tranquilosImg },
    { id: 6, nombre: 'Fiestas', imagen: fiestasImg },
    { id: 7, nombre: 'Al aire libre', imagen: aireLibreImg },
    { id: 8, nombre: 'Recitales', imagen: recitalesImg }
  ];

  const momentos = [
    { id: 9, nombre: 'Mañana', imagen: mananaImg },
    { id: 10, nombre: 'Noches', imagen: nochesImg },
    { id: 11, nombre: 'Entre semana', imagen: entreSemanaImg },
    { id: 12, nombre: 'Fines de semana', imagen: finesSemanaImg }
  ];

  const toggleSelection = (category, id) => {
    setSelectedPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(itemId => itemId !== id)
        : [...prev[category], id]
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/preferences', {
        userId: localStorage.getItem('userId'),
        preferences: selectedPreferences
      });
      navigate('/home');
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const renderPreferenceSection = (title, items, category) => (
    <div className="preference-section">
      <h2>{title}</h2>
      <div className="preference-grid">
        {items.map(item => (
          <div
            key={item.id}
            className={`preference-item ${selectedPreferences[category].includes(item.id) ? 'selected' : ''}`}
            onClick={() => toggleSelection(category, item.id)}
          >
            <div className="preference-image-container">
              <img src={item.imagen} alt={item.nombre} />
              {selectedPreferences[category].includes(item.id) && (
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
            <h2>SELECCIONA<br />TUS<br />FAVORITOS</h2>
          </div>
        </div>
        <div className="preferences-actions">
          <button className="continue-button" onClick={handleSubmit}>CONTINUAR</button>
          <button className="skip-button" onClick={handleSkip}>OMITIR</button>
        </div>
      </div>
      <div className="preferences-content">
        {renderPreferenceSection('Tipo de eventos favoritos', tiposEventos, 'eventos')}
        {renderPreferenceSection('Tipos de ambientes favoritos', tiposAmbientes, 'ambientes')}
        {renderPreferenceSection('Momentos favoritos', momentos, 'momentos')}
      </div>
    </div>
  );
};

export default Preferences; 