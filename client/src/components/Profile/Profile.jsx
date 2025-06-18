import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ nombre: '', apellido: '', email: '' });
  const [editField, setEditField] = useState(null); // 'nombre', 'apellido', 'email', 'password'
  const [fieldValue, setFieldValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setUser({ nombre: res.data.nombre, apellido: res.data.apellido, email: res.data.email });
      } catch (err) {
        setError('No se pudo cargar el perfil');
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setMessage('');
    setError('');
    if (field === 'password') {
      setPassword('');
      setConfirmPassword('');
    } else {
      setFieldValue('');
    }
  };

  const handleCancel = () => {
    setEditField(null);
    setFieldValue('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  };

  const handleSave = async (field) => {
    setError('');
    setMessage('');
    if (field === 'password') {
      if (!password || !confirmPassword) {
        setError('Debes completar ambos campos de contraseña');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      try {
        await axiosInstance.put('/users/me', { password });
        setMessage('Contraseña actualizada correctamente');
        setEditField(null);
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError('Error al actualizar la contraseña');
      }
    } else {
      if (!fieldValue) {
        setError('El campo no puede estar vacío');
        return;
      }
      try {
        await axiosInstance.put('/users/me', { [field]: fieldValue });
        setUser(prev => ({ ...prev, [field]: fieldValue }));
        setMessage('Campo actualizado correctamente');
        setEditField(null);
      } catch (err) {
        setError('Error al actualizar el campo');
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <div className="profile-row">
        <span className="profile-label">Nombre:</span>
        {editField === 'nombre' ? (
          <>
            <input
              type="text"
              value={fieldValue}
              onChange={e => setFieldValue(e.target.value)}
              autoFocus
            />
            <button onClick={() => handleSave('nombre')}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <span className="profile-value">{user.nombre}</span>
            <button onClick={() => handleEdit('nombre')}>Editar</button>
          </>
        )}
      </div>
      <div className="profile-row">
        <span className="profile-label">Apellido:</span>
        {editField === 'apellido' ? (
          <>
            <input
              type="text"
              value={fieldValue}
              onChange={e => setFieldValue(e.target.value)}
              autoFocus
            />
            <button onClick={() => handleSave('apellido')}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <span className="profile-value">{user.apellido}</span>
            <button onClick={() => handleEdit('apellido')}>Editar</button>
          </>
        )}
      </div>
      <div className="profile-row">
        <span className="profile-label">Email:</span>
        {editField === 'email' ? (
          <>
            <input
              type="email"
              value={fieldValue}
              onChange={e => setFieldValue(e.target.value)}
              autoFocus
            />
            <button onClick={() => handleSave('email')}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <span className="profile-value">{user.email}</span>
            <button onClick={() => handleEdit('email')}>Editar</button>
          </>
        )}
      </div>
      <div className="profile-row">
        <span className="profile-label">Contraseña:</span>
        {editField === 'password' ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1}}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <div style={{display: 'flex', gap: '0.7rem', marginTop: '0.7rem'}}>
              <button onClick={() => handleSave('password')}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <span className="profile-value">********</span>
            <button onClick={() => handleEdit('password')}>Editar</button>
          </>
        )}
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/Preferences" className="profile-preferences-button">Mis Preferencias</a>
      </div>
    </div>
  );
};

export default Profile; 