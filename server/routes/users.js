const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const transporter = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// Obtener perfil propio (requiere autenticación)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Actualizar perfil propio (requiere autenticación)
router.put('/me', auth, async (req, res) => {
  try {
    // Si se quiere cambiar la contraseña, hashearla aquí
    if (req.body.password) {
      // Aquí deberías hashear la contraseña antes de guardar
      // Ejemplo: req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await updateUser(req.user._id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los usuarios (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo usuario (público)
router.post('/', async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login de usuario (público)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Obtener un usuario específico (protegido)
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Actualizar un usuario (protegido)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un usuario (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Obtener preferencias de usuario (protegido)
router.put('/:id/preferences', auth, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    user.preferencias = req.body.preferences;
    await user.save();
    res.status(200).json({ message: 'Preferencias actualizadas correctamente' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Recuperación de contraseña - solicitar
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'Si el email existe, se enviará un enlace de recuperación.' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hora
    await user.save();
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña NEXO',
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Si no solicitaste este cambio, ignora este correo.</p>`
    });
    res.json({ message: 'Si el email existe, se enviará un enlace de recuperación.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

// Recuperación de contraseña - restablecer
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token inválido o expirado.' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

// Login/registro con Google
router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client();
  try {
    // Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID // Opcional, pero recomendable
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    if (!email) return res.status(400).json({ message: 'No se pudo obtener el email de Google.' });
    // Buscar usuario existente
    let user = await User.findOne({ email });
    if (!user) {
      // Crear usuario nuevo
      user = new User({
        nombre: name || 'Usuario Google',
        apellido: '',
        email,
        password: token, // Nunca se usará, pero es requerido
        tipo: 3,
        acceptedTerms: false
      });
      await user.save();
    }
    // Generar JWT propio
    const jwtToken = jwt.sign(
      { userId: user._id, tipo: user.tipo },
      process.env.JWT_SECRET || 'tu_secreto_seguro',
      { expiresIn: '1h' }
    );
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ message: 'Token de Google inválido.' });
  }
});

module.exports = router; 