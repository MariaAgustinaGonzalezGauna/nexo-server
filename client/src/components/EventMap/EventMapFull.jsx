import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const EventMapFull = ({ events, center = [-26.8241, -65.2226], zoom = 13 }) => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // Filtrar eventos con coordenadas
  const eventsWithCoords = events.filter(e => e.lat && e.lng);
  
  console.log('EventMapFull - Total eventos:', events.length);
  console.log('EventMapFull - Eventos con coordenadas:', eventsWithCoords.length);

  const handleMarkerClick = (eventId) => {
    console.log('Marker clicked:', eventId);
    console.log('Currently selected:', selectedId);
    
    if (selectedId === eventId) {
      console.log('Deselecting marker');
      setSelectedId(null);
    } else {
      console.log('Selecting marker');
      setSelectedId(eventId);
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setSelectedId(null);
  };

  const handleVerMas = () => {
    if (selectedEvent) {
      const isAuthenticated = localStorage.getItem('token') !== null;
      
      if (isAuthenticated) {
        console.log('Usuario autenticado, navegando a evento:', selectedEvent._id);
        navigate(`/evento/${selectedEvent._id}`);
      } else {
        console.log('Usuario no autenticado, redirigiendo a login');
        navigate('/login');
      }
    }
  };

  const handleCompartir = () => {
    if (selectedEvent) {
      const url = `${window.location.origin}/event/${selectedEvent._id}`;
      const text = `¡Mira este evento: ${selectedEvent.nombre}!`;
      
      if (navigator.share) {
        // Para dispositivos móviles con API de compartir nativa
        navigator.share({
          title: selectedEvent.nombre,
          text: text,
          url: url
        });
      } else {
        // Para navegadores de escritorio - copiar al portapapeles
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          alert('¡Enlace copiado al portapapeles!');
        }).catch(() => {
          // Fallback si clipboard no funciona
          const textArea = document.createElement('textarea');
          textArea.value = `${text} ${url}`;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('¡Enlace copiado al portapapeles!');
        });
      }
    }
  };

  // Obtener el evento seleccionado
  const selectedEvent = eventsWithCoords.find(event => event._id === selectedId);
  
  console.log('Selected event:', selectedEvent);
  console.log('Selected ID:', selectedId);
  console.log('Modal should show:', !!selectedEvent);

  // Si no hay eventos con coordenadas, mostrar mensaje
  if (eventsWithCoords.length === 0) {
    return (
      <div style={{ width: '100%', height: '600px', margin: '3rem 0', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <h3>No hay eventos con ubicación en el mapa</h3>
          <p>Los eventos necesitan tener coordenadas (lat, lng) para aparecer en el mapa</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '600px',
      borderRadius: '18px', 
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      overflow: 'hidden',
      margin: '0 auto',
      maxWidth: '1200px',
      position: 'relative'
    }}>
      <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {eventsWithCoords.map(event => {
          const isSelected = selectedId === event._id;
          const icon = L.divIcon({
            html: `<div style="background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15); width: ${isSelected ? 72 : 48}px; height: ${isSelected ? 72 : 48}px; display: flex; align-items: center; justify-content: center; border: 2px solid #F8B133; transition: width 0.2s, height 0.2s; cursor: pointer;">
              <img src='${event.imagenUrl}' style='width: ${isSelected ? 60 : 38}px; height: ${isSelected ? 60 : 38}px; border-radius: 50%; object-fit: cover; transition: width 0.2s, height 0.2s;' onerror="this.src='https://via.placeholder.com/38x38/F8B133/ffffff?text=E'" />
            </div>`,
            className: '',
            iconSize: [isSelected ? 72 : 48, isSelected ? 72 : 48],
            iconAnchor: [isSelected ? 36 : 24, isSelected ? 72 : 48],
            popupAnchor: [0, isSelected ? -72 : -48]
          });

          return (
            <Marker
              key={event._id}
              position={[event.lat, event.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(event._id),
                dblclick: () => handleMarkerClick(event._id),
                mousedown: () => handleMarkerClick(event._id),
                touchstart: () => handleMarkerClick(event._id),
                touchend: () => handleMarkerClick(event._id)
              }}
            />
          );
        })}
      </MapContainer>

      {/* Panel lateral para mostrar el evento seleccionado */}
      {selectedEvent && (
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '350px',
            maxHeight: 'calc(100% - 40px)',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 999,
            border: '2px solid #F8B133',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ 
            background: '#F8B133',
            color: '#000',
            padding: '1rem 1.5rem',
            fontWeight: '700',
            fontSize: '1.1rem',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '2px solid  #D9D9D9'
          }}>
            <span>Evento Seleccionado</span>
            <button 
              onClick={handleCloseModal}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#c0392b';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#e74c3c';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem', flex: 1, overflow: 'auto' }}>
            {/* Event Image */}
            <div style={{
              width: '100%',
              height: '200px',
              borderRadius: '12px',
              marginBottom: '1rem',
              overflow: 'hidden',
              border: '1px solid #D9D9D9'
            }}>
              <img 
                src={selectedEvent.imagenUrl} 
                alt={selectedEvent.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/350x200/F8B133/ffffff?text=Imagen+del+Evento';
                }}
              />
            </div>
            
            {/* Event Details */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ 
                color: '#000', 
                fontSize: '1.2rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem' 
              }}>
                {selectedEvent.nombre}
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                {selectedEvent.fecha}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                {selectedEvent.lugar}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={handleVerMas}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#F8B133',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#fb8c00';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#F8B133';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                VER MÁS
              </button>
              
              <button 
                onClick={handleCompartir}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: '#D9D9D9',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#ccc';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#D9D9D9';
                }}
              >
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de ayuda */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        💡 Haz clic en los globos para ver los eventos
      </div>
    </div>
  );
};

export default EventMapFull; 