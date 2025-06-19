import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const EventMapMini = ({ lat, lng, nombre }) => {
  const [open, setOpen] = useState(false);
  if (!lat || !lng) return null;
  return (
    <>
      <div style={{ width: 540, height: 360, borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer', border: '2px solid #1976d2' }} onClick={() => setOpen(true)}>
        <MapContainer center={[lat, lng]} zoom={15} style={{ width: '100%', height: '100%' }} dragging={true} scrollWheelZoom={true} doubleClickZoom={true} zoomControl={true} attributionControl={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={markerIcon} />
        </MapContainer>
      </div>
      {open && (
        <div style={modalStyle} onClick={() => setOpen(false)}>
          <div style={{ width: '95vw', height: '90vh', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 12, right: 18, zIndex: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
            <MapContainer center={[lat, lng]} zoom={16} style={{ width: '100%', height: '100%' }} dragging={true} scrollWheelZoom={true} doubleClickZoom={true} zoomControl={true} attributionControl={true}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={markerIcon} />
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default EventMapMini; 