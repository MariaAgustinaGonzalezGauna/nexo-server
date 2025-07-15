import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Comments.css";

const CommentSection = ({ eventoId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");

  useEffect(() => {
    fetchComentarios();
  }, [eventoId]);

  const fetchComentarios = async () => {
    const res = await axios.get(`http://localhost:5000/api/comments/${eventoId}`);
    setComentarios(res.data);
  };

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    await axios.post(`http://localhost:5000/api/comments/${eventoId}`, {
      texto,
      autor,
    });

    setTexto("");
    setAutor("");
    fetchComentarios();
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Comentarios</h3>
      
      <form className="comments-form" onSubmit={enviarComentario}>
        <input
          className="input-nombre"
          type="text"
          placeholder="Tu nombre"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        
        <textarea
          className="textarea-comentario"
          placeholder="Escribe un comentario..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        
        <button className="btn-enviar" type="submit">Enviar</button>
      </form>

      <ul className="lista-comentarios">
        {comentarios.map((comentario) => (
          <li key={comentario._id} className="comentario-item">
            <strong>{comentario.autor || "Anónimo"}:</strong> {comentario.texto}
            <br />
            <small>{new Date(comentario.fecha).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
