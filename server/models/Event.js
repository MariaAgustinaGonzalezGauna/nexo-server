const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  lugar: {
    type: String,
    required: true,
    trim: true
  },
  imagenUrl: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validar formato dd/mm/aaaa
        return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/.test(v);
      },
      message: props => `${props.value} no es una fecha válida. Use el formato dd/mm/aaaa`
    }
  },
  hora: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validar formato hh:mm (24 horas)
        return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} no es una hora válida. Use el formato hh:mm (24 horas)`
    }
  },
  informacion: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    trim: true
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  duenioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    validate: {
      validator: async function(value) {
        if (!value) return true;
        
        const user = await mongoose.model('User').findById(value);
        return user && user.tipo === 2;
      },
      message: 'El ID de dueño debe corresponder a un usuario con tipo dueño'
    }
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Middleware para validar que la fecha y hora no sean anteriores a la actual
eventSchema.pre('save', function(next) {
  const [dia, mes, anio] = this.fecha.split('/');
  const [hora, minutos] = this.hora.split(':');
  
  const fechaEvento = new Date(
    parseInt(anio),
    parseInt(mes) - 1,
    parseInt(dia),
    parseInt(hora),
    parseInt(minutos)
  );
  
  if (fechaEvento < new Date()) {
    next(new Error('La fecha y hora del evento no pueden ser anteriores a la fecha actual'));
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 