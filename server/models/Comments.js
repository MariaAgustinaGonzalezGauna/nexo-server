const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  texto: String,
  autor: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
  eventoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
