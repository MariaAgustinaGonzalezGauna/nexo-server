import React, { useState, useEffect } from "react";
import data from "../../config/data";
import axios from "axios";
import "./Comments.css";
import StarRate from "../Stars/starRate";
import CommentStars from "../Stars/CommentStars";

const CommentSection = ({ eventoId, onRatingUpdate }) => {
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [userName, setUserName] = useState("");
  const [userHasComment, setUserHasComment] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000; // Límite de caracteres

  useEffect(() => {
    fetchComentarios();
    fetchUserName();
  }, [eventoId]);

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get("https://render-zqin.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Obtener solo el nombre de pila (primer nombre)
      const fullName = response.data.nombre;
      const firstName = fullName.split(' ')[0]; // Toma solo la primera palabra
      setUserName(firstName);
      setAutor(firstName); // Rellenar automáticamente el campo
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  };

  const fetchComentarios = async () => {
    const res = await axios.get(`https://render-zqin.onrender.com/api/comments/${eventoId}`);
    setComentarios(res.data);
    
    // Verificar si el usuario ya tiene un comentario
    if (userName) {
      const userComment = res.data.find(comment => comment.autor === userName);
      setUserHasComment(!!userComment);
    }
  };

  const handleRatingChange = (newStats) => {
    // Guardar la puntuación del usuario para incluirla en el comentario
    // Usar la puntuación actual del usuario, no el promedio
    console.log('Puntuación actualizada:', newStats);
    
    // Llamar al callback para actualizar el StarDisplay
    if (onRatingUpdate) {
      onRatingUpdate();
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      // Obtener la puntuación actual del usuario para este evento
      let userCurrentRating = 0;
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const ratingResponse = await axios.get(`https://render-zqin.onrender.com/api/ratings/evento/${eventoId}/usuario`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          userCurrentRating = ratingResponse.data.puntuacion || 0;
        }
      } catch (error) {
        console.log('No se pudo obtener la puntuación del usuario:', error);
      }

      const response = await axios.post(`${}/api/comments/${eventoId}`, {
        texto,
        autor,
        puntuacion: userCurrentRating,
      });

      setTexto("");
      // No resetear el autor, mantener el nombre del usuario
      setAutor(userName);
      
      // Mostrar mensaje según si se creó o actualizó
      if (response.status === 201) {
        console.log('Comentario creado exitosamente');
        setUserHasComment(true);
      } else if (response.status === 200) {
        console.log('Comentario actualizado exitosamente');
        setUserHasComment(true);
      }
      
      fetchComentarios();
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar el comentario. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Comentarios y Puntuación</h3>
      
      {/* Sección de puntuación */}
      <div className="rating-section">
        <h4>¿Cómo calificarías este evento?</h4>
        <div className="star-rating-container">
          <StarRate 
            eventoId={eventoId} 
            onRatingChange={handleRatingChange}
            readOnly={false}
          />
        </div>
      </div>
      
      <form className="comments-form" onSubmit={enviarComentario}>
        <textarea
          className="textarea-comentario"
          placeholder="Escribe un comentario..."
          value={texto}
          onChange={(e) => {
            const newText = e.target.value;
            if (newText.length <= MAX_CHARS) {
              setTexto(newText);
              setCharCount(newText.length);
            }
          }}
          maxLength={MAX_CHARS}
        />
        
        <div className="char-counter">
          {charCount}/{MAX_CHARS} caracteres
        </div>
        
        <button className="btn-enviar" type="submit">
          {userHasComment ? 'Actualizar Comentario' : 'Enviar Comentario'}
        </button>
      </form>

      <ul className="lista-comentarios">
        {comentarios.map((comentario) => (
          <li key={comentario._id} className="comentario-item">
            <div className="comentario-header">
              <strong>{comentario.autor || "Anónimo"}</strong>
              <CommentStars rating={comentario.puntuacion} size="small" />
            </div>
            <div className="comentario-texto">{comentario.texto}</div>
            <small className="comment-date">{new Date(comentario.fecha).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
