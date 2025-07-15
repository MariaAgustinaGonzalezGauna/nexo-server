const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');

// Obtener comentarios de un evento
router.get('/:eventoId', async (req, res) => {
  try {
    const comentarios = await Comment.find({ eventoId: req.params.eventoId }).sort({ fecha: -1 });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo comentario para un evento
router.post('/:eventoId', async (req, res) => {
  const { texto, autor } = req.body;

  try {
    const nuevoComentario = new Comment({
      texto,
      autor,
      eventoId: req.params.eventoId,
    });

    const comentarioGuardado = await nuevoComentario.save();
    res.status(201).json(comentarioGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
  