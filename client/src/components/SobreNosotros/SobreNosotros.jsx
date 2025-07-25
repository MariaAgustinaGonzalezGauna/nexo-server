import React from 'react';
import './SobreNosotros.css';
import logo from '../../assets/nexo-logo.png';
import unstaLogo from '../../assets/unsta-logo.png';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      <div className="sobre-nosotros-content">
        <div className="header-section">
          <img src={logo} alt="NEXO Logo" className="nexo-logo" />
          <h1>Sobre NEXO</h1>
          <p className="subtitle">Conectando eventos, conectando personas</p>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h2>¿Qué es NEXO?</h2>
            <p>
              NEXO es una plataforma innovadora diseñada para conectar a los usuarios con los mejores eventos 
              de su ciudad. Nuestra misión es facilitar el descubrimiento de experiencias únicas y crear 
              conexiones significativas entre organizadores de eventos y asistentes.
            </p>
          </div>

          <div className="info-card">
            <h2>Nuestra Misión</h2>
            <p>
              Transformar la forma en que las personas descubren y participan en eventos locales, 
              proporcionando una plataforma intuitiva que beneficie tanto a organizadores como a 
              asistentes, promoviendo la cultura y el entretenimiento en nuestra comunidad.
            </p>
          </div>

          <div className="info-card">
            <h2>Características Principales</h2>
            <ul>
              <li>Descubrimiento inteligente de eventos basado en preferencias</li>
              <li>Sistema de calificaciones y comentarios</li>
              <li>Gestión completa de eventos para organizadores</li>
              <li>Interfaz intuitiva y fácil de usar</li>
              <li>Modo oscuro para una mejor experiencia visual</li>
              <li>Acceso desde cualquier dispositivo</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Para Organizadores</h2>
            <p>
              NEXO ofrece herramientas completas para la gestión de eventos, incluyendo creación, 
              edición, y seguimiento del estado de aprobación. Los organizadores pueden subir 
              imágenes, establecer fechas y horarios, y gestionar toda la información de sus eventos 
              de manera eficiente.
            </p>
          </div>

          <div className="info-card">
            <h2>Para Usuarios</h2>
            <p>
              Los usuarios pueden explorar eventos personalizados según sus intereses, calificar 
              experiencias, dejar comentarios, y mantenerse informados sobre los mejores eventos 
              de su ciudad. NEXO hace que encontrar el evento perfecto sea simple y divertido.
            </p>
          </div>
        </div>

        <div className="partners-section">
          <h2>Desarrollado en colaboración con</h2>
          <div className="partners-logos">
            <img src={unstaLogo} alt="UNSTA Logo" className="partner-logo" />
            <div className="partner-info">
              <h3>Universidad del Norte Santo Tomás de Aquino</h3>
              <p>Proyecto desarrollado como parte de la formación académica</p>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h2>Contacto</h2>
          <p>
            ¿Tienes preguntas o sugerencias? Nos encantaría escuchar de ti.
          </p>
          <div className="contact-info">
            <p>📧 Email: contacto@nexo.com</p>
            <p>📱 Teléfono: +54 9 381 123-4567</p>
            <p>📍 Ubicación: San Miguel de Tucumán, Argentina</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosotros; 