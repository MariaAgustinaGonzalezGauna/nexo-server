const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const entitySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  imagenUrl: {
    type: String,
    required: true,
    trim: true
  },
  puntuacion: [ratingSchema],
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

const Entity = mongoose.model('Entities', entitySchema);

module.exports = Entity;