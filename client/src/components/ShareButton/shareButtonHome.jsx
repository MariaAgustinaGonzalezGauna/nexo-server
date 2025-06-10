import React, { useState } from 'react';
import './shareButtonHome.css';

const ShareButtonHome = ({ link }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar el enlace', err);
    }
  };

  return (
    <button
      className={`share-button ${copiado ? 'copiado' : ''}`}
      onClick={handleCopy}
    >
      {copiado ? 'Enlace copiado' : 'Compartir'}
    </button>
  );
};

export default ShareButtonHome;
