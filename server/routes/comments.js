const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');

// Obtener comentarios de un evento
router.get('/:eventoId', async (req, res) => {
  try {
    const comentarios = await Comment.find({ eventoId: req.params.eventoId }).sort({ fecha: -1 });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo comentario para un evento (o actualizar si ya existe)
router.post('/:eventoId', async (req, res) => {
  const { texto, autor, puntuacion } = req.body;

  // Validaciones
  if (!texto || !texto.trim()) {
    return res.status(400).json({ message: 'El texto del comentario es requerido' });
  }

  if (!autor || !autor.trim()) {
    return res.status(400).json({ message: 'El autor del comentario es requerido' });
  }

  // Validar que la puntuación esté en el rango correcto
  if (puntuacion !== undefined && (puntuacion < 0 || puntuacion > 5)) {
    return res.status(400).json({ message: 'La puntuación debe estar entre 0 y 5' });
  }

  try {
    // Buscar si ya existe un comentario de este usuario para este evento
    const comentarioExistente = await Comment.findOne({ 
      eventoId: req.params.eventoId, 
      userId: autor.trim() 
    });

    if (comentarioExistente) {
      // Actualizar el comentario existente
      comentarioExistente.texto = texto.trim();
      comentarioExistente.puntuacion = puntuacion || 0;
      comentarioExistente.fecha = new Date(); // Actualizar la fecha
      
      const comentarioActualizado = await comentarioExistente.save();
      console.log('Comentario actualizado exitosamente:', comentarioActualizado);
      res.status(200).json(comentarioActualizado);
    } else {
      // Crear nuevo comentario
      const nuevoComentario = new Comment({
        texto: texto.trim(),
        autor: autor.trim(),
        puntuacion: puntuacion || 0,
        eventoId: req.params.eventoId,
        userId: autor.trim(),
      });

      const comentarioGuardado = await nuevoComentario.save();
      console.log('Comentario creado exitosamente:', comentarioGuardado);
      res.status(201).json(comentarioGuardado);
    }
  } catch (err) {
    console.error('Error al crear/actualizar comentario:', err);
    
    // Manejar errores específicos de Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `Error de validación: ${errors.join(', ')}` });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ya existe un comentario de este usuario para este evento' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor al crear/actualizar el comentario' });
  }
});

module.exports = router;
  