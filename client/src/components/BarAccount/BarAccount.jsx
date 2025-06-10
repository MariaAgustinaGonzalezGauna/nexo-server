import React, { useState } from 'react';
import axios from 'axios';
import './BarAccount.css';

function BarAccount({ token }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lugar: '',
    imagenUrl: '',
    fecha: '',
    hora: '',
    informacion: '',
    tipo: '',
    entidad: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  // Maneja los cambios de inputs
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      // Clona los datos
      const dataToSend = { ...formData };
      // Si entidad está vacío, elimínalo
      if (!dataToSend.entidad) {
        delete dataToSend.entidad;
      }
      // Configura headers con el token para autorización
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      // POST a tu API de eventos
      const response = await axios.post('/api/events', dataToSend, config);
      setMensaje('Evento creado correctamente');
      setFormData({
        nombre: '',
        descripcion: '',
        lugar: '',
        imagenUrl: '',
        fecha: '',
        hora: '',
        informacion: '',
        tipo: '',
        entidad: ''
      });
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al crear el evento');
    }
    setLoading(false);
  };

  return (
    <div className="barAccountContainer">
    <div className="barAccountLeft">
      <h1 className="barAccountTitle">
        BIENVENIDO<br />A NEXO
        <span className="barAccountSubtitle">CONTANOS<br />SOBRE TU<br />EVENTO</span>
      </h1>
      <div className="barAccountImageUpload">
        {/* Podés poner la lógica de subida de imagen si querés, o una preview */}
      </div>
    </div>
  
    <form className="barAccountForm" onSubmit={handleSubmit}>
      <label>Nombre</label>
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        minLength={3}
      />
      <label>Descripción</label>
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        required
        maxLength={100}
      />
      <label>Lugar</label>
      <input
        name="lugar"
        value={formData.lugar}
        onChange={handleChange}
        required
        minLength={3}
      />
       <label>Imagen</label>
      <input
        name="imagenUrl"
        value={formData.imagenUrl}
        onChange={handleChange}
        placeholder="URL de la imagen"
        required
      />
      <label>Fecha</label>
      <input
        name="fecha"
        value={formData.fecha}
        onChange={handleChange}
        required
        pattern="\d{2}/\d{2}/\d{4}"
      />
      <label>Hora</label>
      <input
        name="hora"
        value={formData.hora}
        onChange={handleChange}
        required
        pattern="[0-2][0-9]:[0-5][0-9]"
      />
      <label>Información</label>
      <textarea
        name="informacion"
        value={formData.informacion}
        onChange={handleChange}
      />
      <div className="barAccountRow">
        <label>TIPO DE EVENTO
          <select name="tipo" value={formData.tipo} onChange={handleChange} required>
            <option value="">Seleccionar</option>
            <option value="musical">Musical</option>
            <option value="cine">Cine</option>
            <option value="gastronomia">Gastronomía</option>
            <option value="social">Social</option>
            <option value="teatro">Teatro</option>
            <option value="recreativo">Recreativo</option>
            <option value="deportivo">Deportivo</option>
          </select>
        </label>
      </div>
  
      <button className="barAccountSubmit" type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Evento'}
      </button>
  
      {mensaje && <p>{mensaje}</p>}
    </form>
  </div>
  
  );
}

export default BarAccount;
