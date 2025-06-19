import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError('Error al enviar el email. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2.5rem 2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', margin: '0.5rem 0 1.2rem 0', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.7rem', borderRadius: 6, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
        {message && <div style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
};

export default ForgotPassword; 