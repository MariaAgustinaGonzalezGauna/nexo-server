const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  tipo: {
    type: Number,
    enum: [1, 2, 3], // 1 = administrador, 2 = dueño, 3 = normal
    default: 3
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  preferencias: {
    type: Array,
    default: []
  },
  acceptedTerms: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  const user = this;
  
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (!user.isModified('password')) return next();
  
  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(10);
    // Hash de la contraseña
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 