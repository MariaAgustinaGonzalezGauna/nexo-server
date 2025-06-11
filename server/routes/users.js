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

module.exports = router; 