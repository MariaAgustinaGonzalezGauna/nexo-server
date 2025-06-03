import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');
  const location = useLocation();
  
  // Si no está autenticado, siempre redirigir a la página principal
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si es una ruta de admin y el usuario no es admin
  if (location.pathname.startsWith('/admin') && userType !== '1') {
    return <Navigate to="/home" replace />;
  }

  // Si es un admin intentando acceder a rutas normales
  if (userType === '1' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/eventos" replace />;
  }

  return children;
};

export default ProtectedRoute; 