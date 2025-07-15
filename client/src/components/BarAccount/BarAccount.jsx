import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BarAccount.css';
import EventLocationPicker from '../EventMap/EventLocationPicker';

function BarAccount() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lugar: '',
    imagenUrl: '',
    fecha: '',
    hora: '',
    informacion: '',
    tipo: '',
    entidad: '',
    lat: null,
    lng: null
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const API_URL = 'http://localhost:5000';
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const timePickerRef = useRef(null);

  // Cerrar el selector de tiempo cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimePicker]);

  // Si hay id, cargar datos del evento
  useEffect(() => {
    const fetchEvento = async () => {
      if (id) {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const res = await axios.get(`${API_URL}/api/events/event/${id}`, config);
          
          // Parsear la hora existente si existe
          let hora = res.data.hora || '';
          if (hora) {
            const [hours, minutes] = hora.split(':');
            const hour = parseInt(hours);
            let period, displayHour;
            
            if (hour === 0) {
              period = 'AM';
              displayHour = '12';
            } else if (hour < 12) {
              period = 'AM';
              displayHour = hour.toString().padStart(2, '0');
            } else if (hour === 12) {
              period = 'PM';
              displayHour = '12';
            } else {
              period = 'PM';
              displayHour = (hour - 12).toString().padStart(2, '0');
            }
            
            setSelectedHour(displayHour);
            setSelectedMinute(minutes);
            setSelectedPeriod(period);
          }
          
          setFormData({
            nombre: res.data.nombre || '',
            descripcion: res.data.descripcion || '',
            lugar: res.data.lugar || '',
            imagenUrl: res.data.imagenUrl || '',
            fecha: res.data.fecha || '',
            hora: res.data.hora || '',
            informacion: res.data.informacion || '',
            tipo: res.data.tipo || '',
            entidad: res.data.entidad?._id || '',
            lat: res.data.lat || null,
            lng: res.data.lng || null
          });
        } catch (error) {
          setMensaje('No se pudo cargar el evento');
        }
      }
    };
    fetchEvento();
  }, [id]);

  // Generar opciones de horas (1-12)
  const generateHours = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  // Generar opciones de minutos (00-59)
  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  };

  // Formatear hora para mostrar en el display
  const formatTimeDisplay = (hour, minute, period) => {
    return `${hour}:${minute} ${period}`;
  };

  // Convertir hora de 12h a 24h para el formato requerido
  const convertTo24Hour = (hour, minute, period) => {
    let hour24 = parseInt(hour);
    
    if (period === 'PM') {
      if (hour24 !== 12) {
        hour24 += 12;
      }
    } else if (period === 'AM') {
      if (hour24 === 12) {
        hour24 = 0;
      }
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  // Actualizar la hora en formData cuando cambien los selectores
  useEffect(() => {
    if (selectedHour && selectedMinute && selectedPeriod) {
      const hora24 = convertTo24Hour(selectedHour, selectedMinute, selectedPeriod);
      setFormData(prev => ({ ...prev, hora: hora24 }));
    }
  }, [selectedHour, selectedMinute, selectedPeriod]);

  // Inicializar valores por defecto si no hay hora seleccionada
  useEffect(() => {
    if (!formData.hora && !id) {
      setSelectedHour('12');
      setSelectedMinute('00');
      setSelectedPeriod('AM');
    }
  }, [formData.hora, id]);

  // Maneja los cambios de inputs
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "fecha" && value) {
      // Convierte yyyy-mm-dd a dd/mm/aaaa
      const [yyyy, mm, dd] = value.split("-");
      if (yyyy && mm && dd) {
        value = `${dd}/${mm}/${yyyy}`;
      } else {
        // Si el usuario escribe dd/mm/aa, lo convierte a dd/mm/aaaa
        const match = value.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
        if (match) {
          let [_, d, m, a] = match;
          value = `${d}/${m}/20${a}`;
        }
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMensaje('No estás autenticado. Por favor, inicia sesión.');
        return;
      }
      const dataToSend = { ...formData };
      if (userType === '2') {
        dataToSend.entidad = userId;
      } else {
        delete dataToSend.entidad;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      if (id) {
        // Modo edición: PUT
        await axios.put(`${API_URL}/api/events/${id}`, dataToSend, config);
        setMensaje('Evento actualizado correctamente');
      } else {
        // Modo creación: POST
        await axios.post(`${API_URL}/api/events`, dataToSend, config);
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
          entidad: '',
          lat: null,
          lng: null
        });
        // Resetear el reloj
        setSelectedHour('12');
        setSelectedMinute('00');
        setSelectedPeriod('AM');
      }
      // Redirigir a Mis Eventos después de guardar
      setTimeout(() => navigate('/mis-eventos'), 1000);
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al guardar el evento');
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
        type="date"
        name="fecha"
        value={formData.fecha ? (() => {
          // Convierte dd/mm/aaaa a yyyy-mm-dd para el input
          const [dd, mm, yyyy] = formData.fecha.split("/");
          if (dd && mm && yyyy) return `${yyyy}-${mm}-${dd}`;
          return '';
        })() : ''}
        onChange={handleChange}
        required
      />
      <label>Hora</label>
      <div className="timePickerContainer" ref={timePickerRef}>
        <div 
          className="timePickerDisplay"
          onClick={() => setShowTimePicker(!showTimePicker)}
        >
          <span className="timeDisplay">
            {formatTimeDisplay(selectedHour, selectedMinute, selectedPeriod)}
          </span>
          <span className="timePickerIcon">🕐</span>
        </div>
        
        {showTimePicker && (
          <div className="timePickerDropdown">
            <div className="timePickerRow">
              <div className="timePickerColumn">
                <label>Hora</label>
                <select 
                  value={selectedHour} 
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="timeSelect"
                >
                  {generateHours().map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
              
              <div className="timePickerColumn">
                <label>Minutos</label>
                <select 
                  value={selectedMinute} 
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="timeSelect"
                >
                  {generateMinutes().map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>
              
              <div className="timePickerColumn">
                <label>Periodo</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="timeSelect"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            
            <div className="timePickerActions">
              <button 
                type="button" 
                onClick={() => setShowTimePicker(false)}
                className="timePickerButton"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
      
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
      <label>Ubicación en el mapa</label>
      <EventLocationPicker
        value={formData.lat && formData.lng ? [formData.lat, formData.lng] : null}
        onChange={({ lat, lng }) => setFormData(prev => ({ ...prev, lat, lng }))}
      />
      <button className="barAccountSubmit" type="submit" disabled={loading}>
        {loading ? (id ? 'Guardando...' : 'Creando...') : (id ? 'Guardar Cambios' : 'Crear Evento')}
      </button>
  
      {mensaje && <p>{mensaje}</p>}
    </form>
  </div>
  
  );
}

export default BarAccount;
