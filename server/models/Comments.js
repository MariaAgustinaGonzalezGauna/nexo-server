const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let eventSchema = new Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El usuario es obligatorio']
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: [true, 'El evento es obligatorio']
    },
    comentario: {
        type: String,
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    calificacion: {
        type: Number,
        required: [true, 'La calificación es obligatoria'],
        min: 1,
        max: 5
    }
});


module.exports = mongoose.model('Comment', eventSchema);