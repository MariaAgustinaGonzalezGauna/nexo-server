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
import Profile from './components/Profile/Profile';
import GestorEventos from './components/GestionEventos/GestorEventos';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Terms from './components/Terms/Terms';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ForgotPassword/ResetPassword';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return userType === '1' ? '/admin/eventos/pendientes' : '/home';
  };

  return (
    <GoogleOAuthProvider clientId="608923758865-v081vr522kemg0sjrjrcbjhsobiot7n1.apps.googleusercontent.com">
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
            <Route path="/barAccount" element={<ProtectedRoute><BarAccount /></ProtectedRoute>} />
            <Route path="/barAccount/:id" element={<ProtectedRoute><BarAccount /></ProtectedRoute>} />

            {/* Rutas protegidas */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/EventPage" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
            <Route path="/evento/:id" element={<EventView />} />
            <Route path="/mis-eventos" element={<ProtectedRoute><GestorEventos /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

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

            {/* Rutas adicionales */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;