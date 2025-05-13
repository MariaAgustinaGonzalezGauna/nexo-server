const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, tipo: user.tipo },
    process.env.JWT_SECRET || 'tu_clave_secreta_temporal',
    { expiresIn: '1h' }
  );
};

// Obtener todos los usuarios
const getUsers = async () => {
  return await User.find().select('-password');
};

// Crear un nuevo usuario
const createUser = async (userData) => {
  const user = new User(userData);
  const newUser = await user.save();
  const userResponse = newUser.toObject();
  delete userResponse.password;
  const token = generateToken(newUser);
  return { user: userResponse, token };
};

// Login de usuario
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const userResponse = user.toObject();
  delete userResponse.password;
  const token = generateToken(user);
  return { user: userResponse, token };
};

// Obtener un usuario específico
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

// Actualizar un usuario
const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  Object.assign(user, updateData);
  const updatedUser = await user.save();
  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  return userResponse;
};

// Eliminar un usuario
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  await user.deleteOne();
  return { message: 'Usuario eliminado' };
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
}; 