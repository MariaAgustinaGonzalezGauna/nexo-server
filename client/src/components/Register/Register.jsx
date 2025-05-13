import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import homePeople from '../../assets/home-people.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    repetirContrasena: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error cuando el usuario empiece a escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones del formulario
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    if (!validatePassword(formData.contrasena)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.contrasena !== formData.repetirContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.contrasena
      });

      if (response.data) {
        // Guardar el ID del usuario para usarlo en la página de preferencias
        localStorage.setItem('userId', response.data.user._id);
        navigate('/preferences');
      }
    } catch (err) {
      // Manejar diferentes tipos de errores
      if (err.response) {
        switch (err.response.status) {
          case 400:
            if (err.response.data.message.includes('duplicate key')) {
              setError('Este email ya está registrado');
            } else {
              setError(err.response.data.message || 'Error en los datos ingresados');
            }
            break;
          case 500:
            setError('Error en el servidor. Por favor, intenta más tarde');
            break;
          default:
            setError('Error al registrar usuario. Por favor, intenta nuevamente');
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión');
      } else {
        setError('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-image-container">
        <img src={homePeople} alt="NEXO community" className="register-image" />
        <div className="register-overlay">
          <h1>REGISTRATE</h1>
        </div>
      </div>
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="nombre"
            placeholder="NOMBRE"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="APELLIDO"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="CONTRASEÑA"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repetirContrasena"
            placeholder="REPETIR CONTRASEÑA"
            value={formData.repetirContrasena}
            onChange={handleChange}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="enviar-button">ENVIAR</button>
          <p className="login-link">
            Ya tienes una cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 