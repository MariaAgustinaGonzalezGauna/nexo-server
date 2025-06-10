import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import BarAccount from './components/BarAccount/BarAccount';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Preferences from './components/Preferences/Preferences';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import EventPage from './components/EventPage/EventPage';
import EventView from './components/EventView/EventView'
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/barAccount" element={<BarAccount />} />
          

          {/* Rutas protegidas */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="/EventPage" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
          <Route path="/mis-eventos" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/EventView/:id" element={<ProtectedRoute><EventView /></ProtectedRoute>} />
          

          {/* Ruta por defecto - redirige a home o inicio según autenticación */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/EventPage" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
