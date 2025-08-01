import React, { useState, useEffect } from "react";
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
  const MAX_CHARS = 1000;

  useEffect(() => {
    const init = async () => {
      await fetchUserName();  // Primero obtenemos el nombre
      await fetchComentarios();  // Luego cargamos los comentarios
    };
    init();
  }, [eventoId]);

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("https://render-zqin.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fullName = response.data.nombre;
      const firstName = fullName.split(" ")[0];
      setUserName(firstName);
      setAutor(firstName);
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(`https://render-zqin.onrender.com/api/comments/${eventoId}`);
      setComentarios(res.data);

      if (userName) {
        const userComment = res.data.find(comment => comment.autor === userName);
        setUserHasComment(!!userComment);
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const handleRatingChange = (newStats) => {
    console.log("Puntuación actualizada:", newStats);
    if (onRatingUpdate) {
      onRatingUpdate();  // Para actualizar componente padre si hace falta
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      let userCurrentRating = 0;
      const token = localStorage.getItem("token");

      if (token) {
        const ratingResponse = await axios.get(
          `https://render-zqin.onrender.com/api/ratings/evento/${eventoId}/usuario`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        userCurrentRating = ratingResponse.data.puntuacion || 0;
      }

      const response = await axios.post(
        `https://render-zqin.onrender.com/api/comments/${eventoId}`,
        {
          texto,
          autor,
          puntuacion: userCurrentRating
        }
      );

      setTexto("");
      setAutor(userName);
      setUserHasComment(true);
      fetchComentarios();

      if (response.status === 201) {
        console.log("Comentario creado exitosamente");
      } else if (response.status === 200) {
        console.log("Comentario actualizado exitosamente");
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Error al enviar el comentario. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Comentarios y Puntuación</h3>

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
          {userHasComment ? "Actualizar Comentario" : "Enviar Comentario"}
        </button>
      </form>

      <ul className="lista-comentarios">
        {comentarios.map((comentario) => (
          <li key={comentario._id} className="comentario-item">
            <div className="comentario-header">
              <strong>{comentario.autor || "Anónimo"}</strong>
              <CommentStars rating={comentario.puntuacion ?? 0} size="small" />
            </div>
            <div className="comentario-texto">{comentario.texto}</div>
            <small className="comment-date">
              {new Date(comentario.fecha).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
