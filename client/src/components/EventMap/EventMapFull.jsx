import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import EventCard from '../EventCard/EventCard';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const EventMapFull = ({ events, center = [-26.8241, -65.2226], zoom = 13 }) => {
  const [selectedId, setSelectedId] = useState(null);

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
      padding: '6rem 0',
      backgroundColor: '#fff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#000',
          letterSpacing: '-0.5px'
        }}>
          Explora eventos en el mapa
        </h2>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '600px', 
          borderRadius: '18px', 
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden'
        }}>
          <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {eventsWithCoords.map(event => {
              const isSelected = selectedId === event._id;
              const icon = L.divIcon({
                html: `<div style="background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15); width: ${isSelected ? 72 : 48}px; height: ${isSelected ? 72 : 48}px; display: flex; align-items: center; justify-content: center; border: 2px solid #1976d2; transition: width 0.2s, height 0.2s; cursor: pointer;">
                  <img src='${event.imagenUrl}' style='width: ${isSelected ? 60 : 38}px; height: ${isSelected ? 60 : 38}px; border-radius: 50%; object-fit: cover; transition: width 0.2s, height 0.2s;' onerror="this.src='https://via.placeholder.com/38x38/1976d2/ffffff?text=E'" />
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

          {/* Modal personalizado para mostrar la EventCard */}
          {selectedEvent && (
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '20px',
                maxWidth: '350px',
                zIndex: 1000,
                border: '2px solid #1976d2'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#1976d2', fontSize: '18px' }}>Evento Seleccionado</h3>
                <button 
                  onClick={handleCloseModal}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
              <EventCard
                id={selectedEvent._id}
                image={selectedEvent.imagenUrl}
                title={selectedEvent.nombre}
                date={selectedEvent.fecha}
                location={selectedEvent.lugar}
                descripcion={selectedEvent.descripcion}
              />
            </div>
          )}

          {/* Botón de ayuda para dispositivos de escritorio */}
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
      </div>
    </div>
  );
};

export default EventMapFull; 