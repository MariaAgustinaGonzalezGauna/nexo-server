import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
}

const EventLocationPicker = ({ value, onChange, center = [-26.8241, -65.2226], zoom = 13 }) => {
  const [position, setPosition] = useState(value || null);

  React.useEffect(() => {
    if (position && onChange) {
      onChange({ lat: position[0], lng: position[1] });
    }
  }, [position, onChange]);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <MapContainer center={position || center} zoom={zoom} style={{ height: '350px', width: '100%', borderRadius: '10px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div style={{ marginTop: '0.7rem', textAlign: 'center', color: '#1976d2' }}>
        {position ? `Ubicación seleccionada: [${position[0].toFixed(5)}, ${position[1].toFixed(5)}]` : 'Haz clic en el mapa para seleccionar la ubicación del evento.'}
      </div>
    </div>
  );
};

export default EventLocationPicker; 