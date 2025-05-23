import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import homePeople from '../../assets/home-people.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data) {
        // Guardar el token y la información del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('userType', response.data.user.tipo);
        navigate('/home');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Email o contraseña incorrectos');
            break;
          case 500:
            setError('Error en el servidor. Por favor, intenta más tarde');
            break;
          default:
            setError('Error al iniciar sesión. Por favor, intenta nuevamente');
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión');
      } else {
        setError('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img src={homePeople} alt="NEXO community" className="login-image" />
        <div className="login-overlay">
          <h1>INICIA SESIÓN</h1>
        </div>
      </div>
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
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
            name="password"
            placeholder="CONTRASEÑA"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="enviar-button">INICIAR SESIÓN</button>
          <p className="register-link">
            ¿No tienes una cuenta? <span onClick={() => navigate('/register')}>Regístrate</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 