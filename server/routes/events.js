const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Obtener todos los eventos (requiere autenticación)
router.get('/', auth, async (req, res) => {
  try {
    const events = await getEvents(req.user.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un evento específico (público)
router.get('/:id', async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Las siguientes rutas requieren autenticación
router.use(auth);

// Crear un nuevo evento (solo administradores y dueños)
router.post('/', checkRole([1, 2]), async (req, res) => {
  try {
    const newEvent = await createEvent(req.body, req.user.id, req.user.tipo);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un evento (solo administradores y dueños)
router.put('/:id', checkRole([1, 2]), async (req, res) => {
  try {
    const updatedEvent = await updateEvent(
      req.params.id,
      req.body,
      req.user.id,
      req.user.tipo
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Eliminar un evento (solo administradores y dueños)
router.delete('/:id', checkRole([1, 2]), async (req, res) => {
  try {
    const result = await deleteEvent(
      req.params.id,
      req.user.id,
      req.user.tipo
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router; 