const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  texto: String,
  autor: String,
  puntuacion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  eventoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true,
  },
  userId: {
    type: String, // Usaremos el nombre del usuario como identificador único
    required: true,
  },
});

// Índice compuesto para evitar comentarios duplicados por usuario y evento
commentSchema.index({ eventoId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);
