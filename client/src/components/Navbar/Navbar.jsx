import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/nexo-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/');
    window.location.reload();
  };

  const handleMapClick = () => {
    navigate('/home');
    setTimeout(() => {
      const mapElement =
        document.querySelector('[style*="EventMapFull"]') ||
        document.querySelector('[style*="600px"]') ||
        document.querySelector('[style*="border-radius: 18px"]');

      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 300);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to={isAuthenticated ? (userType === '1' ? '/admin/eventos' : '/home') : '/'}
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img src={logo} alt="NEXO Logo" className="logo-image" />
        </Link>

        <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menú">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {!isAuthenticated && (
            <>
              {location.pathname !== '/sobre-nosotros' && (
                <Link to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>
                  Sobre Nosotros
                </Link>
              )}
              <button onClick={handleMapClick} className="nav-button">
                Ir al mapa
              </button>
              {location.pathname !== '/login' && (
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Log in
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="register-button" onClick={closeMenu}>
                  REGISTRATE
                </Link>
              )}
            </>
          )}

          {isAuthenticated && (
            <>
              {userType === '2' && (
                <>
                  {location.pathname !== '/mis-eventos' && (
                    <button
                      onClick={() => {
                        navigate('/mis-eventos');
                        closeMenu();
                      }}
                      className="nav-button"
                    >
                      Mis Eventos
                    </button>
                  )}
                  <button onClick={handleMapClick} className="nav-button">
                    Ir al mapa
                  </button>
                  {location.pathname !== '/profile' && (
                    <Link to="/profile" className="nav-link" onClick={closeMenu}>
                      Mi Perfil
                    </Link>
                  )}
                </>
              )}

              {userType === '3' && (
                <>
                  {location.pathname !== '/EventPage' && (
                    <Link to="/EventPage" className="nav-link" onClick={closeMenu}>
                      Eventos para mi
                    </Link>
                  )}
                  <button onClick={handleMapClick} className="nav-button">
                    Ir al mapa
                  </button>
                  {location.pathname !== '/profile' && (
                    <Link to="/profile" className="nav-link" onClick={closeMenu}>
                      Mi Perfil
                    </Link>
                  )}
                </>
              )}

              {userType === '1' && (
                <>
                  {location.pathname !== '/admin/eventos' && (
                    <Link to="/admin/eventos" className="nav-link" onClick={closeMenu}>
                      Gestión de Eventos
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="logout-button"
              >
                CERRAR SESIÓN
              </button>
            </>
          )}
        </div>

        {/* Botón de modo oscuro en el navbar principal */}
        <button 
          className="dark-mode-toggle" 
          onClick={toggleDarkMode}
          aria-label="Cambiar modo oscuro"
        >
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;