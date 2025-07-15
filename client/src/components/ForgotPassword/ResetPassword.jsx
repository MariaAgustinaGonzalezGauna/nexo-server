import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/reset-password', { token, password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Nueva contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', margin: '0.5rem 0 1.2rem 0', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <label htmlFor="confirm">Confirmar contraseña</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          style={{ width: '100%', margin: '0.5rem 0 1.2rem 0', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.7rem', borderRadius: 6, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </button>
        {message && <div style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
};

export default ResetPassword; 