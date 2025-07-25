const mongoose = require('mongoose');

const eventRatingSchema = new mongoose.Schema({
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  fechaPuntuacion: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar puntuaciones duplicadas
eventRatingSchema.index({ evento: 1, usuario: 1 }, { unique: true });

const EventRating = mongoose.model('EventRating', eventRatingSchema);

module.exports = EventRating; 