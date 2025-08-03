import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const sidePanelStyle = {
  position: 'fixed',
  top: '50%',
  right: '20px',
  transform: 'translateY(-50%)',
  width: '350px',
  maxHeight: '80vh',
  background: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  zIndex: 9999,
  border: '2px solid #F8B133',
  display: 'flex',
  flexDirection: 'column'
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  zIndex: 9998,
  backdropFilter: 'blur(2px)'
};

const EventMapMini = ({ lat, lng, nombre, eventId, disablePanel = false }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!lat || !lng) return null;

  const handleVerMas = () => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (isAuthenticated) {
      navigate(`/evento/${eventId}`);
    } else {
      navigate('/login');
    }
  };

  const handleCompartir = () => {
    const url = `${window.location.origin}/evento/${eventId}`;
    const text = `¡Mira este evento: ${nombre}!`;

    if (navigator.share) {
      navigator.share({ title: nombre, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = `${text} ${url}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('¡Enlace copiado al portapapeles!');
      });
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '360px',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(248, 177, 51, 0.2)',
          cursor: disablePanel ? 'default' : 'pointer',
          border: '2px solid #F8B133',
          position: 'relative'
        }}
        onClick={() => {
          if (!disablePanel) setOpen(true);
        }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          dragging={true}
          scrollWheelZoom={false}
          doubleClickZoom={true}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={markerIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <strong style={{ color: '#F8B133', fontSize: '1.1rem' }}>{nombre}</strong>
                <br />
                <small style={{ color: '#666' }}>Haz clic para ver más detalles</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        {!disablePanel && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(248, 177, 51, 0.9)',
            color: '#000',
            padding: '0.3rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            backdropFilter: 'blur(4px)'
          }}>
            Clic para ampliar
          </div>
        )}
      </div>

      {open && (
        <>
          <div style={overlayStyle} onClick={() => setOpen(false)} />
          <div style={sidePanelStyle} onClick={e => e.stopPropagation()}>
            <div style={{
              background: '#F8B133',
              color: '#000',
              padding: '1rem 1.5rem',
              fontWeight: '700',
              fontSize: '1.1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #fb8c00'
            }}>
              <span>Evento Seleccionado</span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
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

            <div style={{ padding: '1.5rem', flex: 1, overflow: 'auto' }}>
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #D9D9D9'
              }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Imagen del evento</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  color: '#000',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  {nombre}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  Fecha del evento
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Ubicación del evento
                </p>
              </div>

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
        </>
      )}
    </>
  );
};

export default EventMapMini;
