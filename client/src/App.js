import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import BarAccount from './components/BarAccount/BarAccount';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Preferences from './components/Preferences/Preferences';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLogin from './components/admin/AdminLogin';
import AdminEventos from './components/admin/AdminEventos';
import EventPage from './components/EventPage/EventPage';
import EventView from './components/EventView/EventView';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return userType === '1' ? '/admin/eventos/pendientes' : '/home';
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            isAuthenticated
              ? <Navigate to={getDefaultRoute()} replace />
              : <Home />
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/barAccount" element={<BarAccount />} />

          {/* Rutas protegidas */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="/EventPage" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
          <Route path="/EventView/:id" element={<ProtectedRoute><EventView /></ProtectedRoute>} />
          <Route path="/mis-eventos" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Rutas de administración */}
          <Route path="/admin/eventos" element={
            <ProtectedRoute>
              <Navigate to="/admin/eventos/pendientes" replace />
            </ProtectedRoute>
          } />
          <Route path="/admin/eventos/:estado" element={
            <ProtectedRoute>
              <AdminEventos />
            </ProtectedRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
