import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import homePeople from '../../assets/home-people.png';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

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
  const [isDuenio, setIsDuenio] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

  const handleTipoClick = () => {
    setIsDuenio(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Debes aceptar los Términos y Condiciones para registrarte.');
      return;
    }
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
      const tipo = isDuenio ? 2 : 3;
      const response = await axios.post('http://localhost:5000/api/users', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.contrasena,
        tipo,
        acceptedTerms,
      });

      if (response.data) {
        // Guardar el token y la información del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('userType', response.data.user.tipo);
        navigate('/Preferences');
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });
      // Guardar token y userId como en el registro tradicional
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      window.location.href = '/';
    } catch (error) {
      alert('Error al registrarse con Google');
    }
  };

  const handleGoogleError = () => {
    alert('Error al autenticar con Google');
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
          <button
            type="button"
            className={`toggle-owner-button${isDuenio ? ' selected' : ''}`}
            onClick={handleTipoClick}
            style={{ marginBottom: '0.3rem', background: 'none', color: isDuenio ? '#333' : '#333', border: 'none', fontWeight: 600, transition: 'background 0.2s, color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
          >
            <span style={{ display: 'inline-block', width: '22px', height: '22px', background: '#fff', border: '2px solid #ffd600', borderRadius: '4px', marginRight: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {isDuenio && '✔'}
            </span>
            QUIERO SUBIR EVENTOS DE MI LOCAL
          </button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="acceptedTerms" style={{ fontSize: '0.98rem' }}>
              Acepto los <span onClick={() => window.open('/terms', '_blank')} style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>Términos y Condiciones</span>
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="register-button">ENVIAR</button>
          <div style={{ margin: '0.1rem 0 0 0', textAlign: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
          <p className="login-link" style={{ marginTop: '0.1rem' }}>
            Ya tienes una cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 