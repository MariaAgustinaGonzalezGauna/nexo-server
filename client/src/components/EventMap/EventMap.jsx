import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createEventIcon = (imgUrl) => L.divIcon({
  html: `<div style="background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border: 2px solid #1976d2;">
    <img src='${imgUrl}' style='width: 38px; height: 38px; border-radius: 50%; object-fit: cover;' />
  </div>`,
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

const EventMap = ({ events, center = [-26.8241, -65.2226], zoom = 13 }) => (
  <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', margin: '2rem 0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {events.filter(e => e.lat && e.lng).map(event => (
      <Marker
        key={event._id}
        position={[event.lat, event.lng]}
        icon={createEventIcon(event.imagenUrl)}
      >
        <Popup>
          <div style={{ textAlign: 'center' }}>
            <img src={event.imagenUrl} alt={event.nombre} style={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }} /><br/>
            <b>{event.nombre}</b><br/>
            {event.lugar}<br/>
            {event.fecha}
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default EventMap; 