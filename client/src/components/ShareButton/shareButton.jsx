import React, { useState } from 'react';
import './shareButton.css'; // Asegurate de que esté en la misma carpeta

const ShareButton = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  return (
    <button
      className={`share-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Enlace copiado' : 'Compartir'}
    </button>
  );
};

export default ShareButton;

