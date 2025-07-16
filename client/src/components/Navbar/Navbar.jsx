import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/nexo-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

        <button className="hamburger" onClick={toggleMenu} aria-label="Menú">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {!isAuthenticated && (
            <>
              <Link to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>
                Sobre Nosotros
              </Link>
              <button onClick={handleMapClick} className="nav-button">
                Ir al mapa
              </button>
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/register" className="register-button" onClick={closeMenu}>
                REGISTRATE
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              {userType === '2' && (
                <>
                  <button
                    onClick={() => {
                      navigate('/mis-eventos');
                      closeMenu();
                    }}
                    className="nav-button"
                  >
                    Mis Eventos
                  </button>
                  <button onClick={handleMapClick} className="nav-button">
                    Ir al mapa
                  </button>
                  <Link to="/profile" className="nav-link" onClick={closeMenu}>
                    Mi Perfil
                  </Link>
                </>
              )}

              {userType === '3' && (
                <>
                  <Link to="/EventPage" className="nav-link" onClick={closeMenu}>
                    Eventos para mi
                  </Link>
                  <button onClick={handleMapClick} className="nav-button">
                    Ir al mapa
                  </button>
                  <Link to="/profile" className="nav-link" onClick={closeMenu}>
                    Mi Perfil
                  </Link>
                </>
              )}

              {userType === '1' && (
                <>
                  <Link to="/admin/eventos" className="nav-link" onClick={closeMenu}>
                    Gestión de Eventos
                  </Link>
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
      </div>
    </nav>
  );
};

export default Navbar;
