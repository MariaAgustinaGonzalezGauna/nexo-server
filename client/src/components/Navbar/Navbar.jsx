import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/nexo-logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/');
    window.location.reload();
  };

  const handleMapClick = () => {
    // Navegar al home y hacer scroll al mapa
    navigate('/home');
    // Usar setTimeout para asegurar que la navegación se complete antes del scroll
    setTimeout(() => {
      // Buscar el elemento del mapa de múltiples maneras
      const mapElement = document.querySelector('[style*="EventMapFull"]') || 
                        document.querySelector('[style*="600px"]') ||
                        document.querySelector('[style*="border-radius: 18px"]');
      
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Si no encuentra el elemento específico, hacer scroll al final de la página
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 300); // Aumentar el tiempo para asegurar que la página se cargue completamente
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? (userType === '1' ? '/admin/eventos' : '/home') : '/'} className="navbar-logo">
          <img src={logo} alt="NEXO Logo" className="logo-image" />
        </Link>
        <div className="navbar-links">
          {!isAuthenticated && (
            <>
              <Link to="/sobre-nosotros" className="nav-link">
                Sobre Nosotros
              </Link>
              <button onClick={handleMapClick} className="nav-button">
                Ir al mapa
              </button>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              {/* Enlaces para usuarios autenticados */}
              {userType === '2' && (
                <button onClick={() => navigate('/mis-eventos')} className="nav-button">
                  Mis Eventos
                </button>
              )}
              {userType === '1' && (
                <Link to="/admin/eventos" className="nav-link">
                  Gestión de Eventos
                </Link>
              )}
              <Link to="/EventPage" className="nav-link">
                Eventos para mi
              </Link>
              <button onClick={handleMapClick} className="nav-button">
                Ir al mapa
              </button>
              <Link to="/profile" className="nav-link">
                Mi Perfil
              </Link>
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