import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import GestorEventos from './components/GestionEventos/GestorEventos';
import BarAccount from './components/BarAccount';
import Preferences from './components/Preferences/Preferences';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/mis-eventos" element={<PrivateRoute><GestorEventos /></PrivateRoute>} />
        <Route path="/gestion-eventos" element={<PrivateRoute><GestorEventos /></PrivateRoute>} />
        <Route path="/barAccount" element={<PrivateRoute><BarAccount /></PrivateRoute>} />
        <Route path="/barAccount/:id" element={<PrivateRoute><BarAccount /></PrivateRoute>} />
        <Route path="/Preferences" element={<PrivateRoute><Preferences /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App; 