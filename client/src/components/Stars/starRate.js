import React, { useState, useEffect } from "react";
import axios from "axios";
import StarIcon from "../../assets/icons/starIcon";
import data from "../../config/data";
export default function StarRate({ eventoId, onRatingChange, readOnly = false }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la puntuación del usuario al cargar el componente
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${data.url}/api/ratings/evento/${eventoId}/usuario`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRating(response.data.puntuacion);
      } catch (error) {
        console.error('Error al obtener puntuación del usuario:', error);
      }
    };

    if (eventoId) {
      fetchUserRating();
    }
  }, [eventoId]);

  const handleRating = async (newRating) => {
    if (readOnly || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para puntuar eventos');
        return;
      }

      const response = await axios.post(`${data.url}/api/ratings/evento/${eventoId}`, 
        { puntuacion: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(response.data);
      }
    } catch (error) {
      console.error('Error al puntuar evento:', error);
      alert('Error al puntuar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = (starIndex) => {
    if (!readOnly) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating" style={{ 
      display: 'flex', 
      gap: '12px', 
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px 0'
    }}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <div
            key={index}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              if (!readOnly) {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.backgroundColor = 'rgba(248, 177, 51, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <StarIcon
              width="52.5px"
              height="52.5px"
              fill={isFilled ? "#F8B133" : "#73738B"}
            />
          </div>
        );
      })}
    </div>
  );
}