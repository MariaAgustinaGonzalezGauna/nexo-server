import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/nexo-logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    // Limpiar todo el localStorage
    localStorage.clear();
    
    // Siempre redirigir a la página principal
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? (userType === '1' ? '/admin/eventos' : '/home') : '/'} className="navbar-logo">
          <img src={logo} alt="NEXO Logo" className="logo-image" />
        </Link>
        <div className="navbar-links">
          {!isAuthenticated && (
            <Link to="/sobre-nosotros" className="nav-link">
              Sobre Nosotros
            </Link>
          )}
          
          {isAuthenticated ? (
            <>
              {/* Enlaces para usuarios autenticados */}
              {userType === '2' && (
                <Link to="/mis-eventos" className="nav-link">
                  Mis Eventos
                </Link>
              )}
              {userType === '1' && (
                <Link to="/admin/eventos" className="nav-link">
                  Gestión de Eventos
                </Link>
              )}
              <button className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={handleLogout} className="logout-button">
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            <>
              {/* Enlaces para usuarios no autenticados */}
              <Link to="/login" className="nav-link">
                Log in
              </Link>
              <button className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Link to="/register" className="register-button">
                REGISTRATE
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 