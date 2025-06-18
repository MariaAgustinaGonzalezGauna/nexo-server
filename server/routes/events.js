const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsPreferences
} = require('../controllers/eventController');

// Obtener todos los eventos (requiere autenticación)
router.get('/all', async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener eventos por preferencias (requiere autenticación)
router.get('/preferences', auth, async (req, res) => {
  try {
    const events = await getEventsPreferences(req.user.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un evento específico (público)
router.get('/event/:id', async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Crear un nuevo evento (público)
router.post('/', async (req, res) => {
  try {
    const newEvent = await createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener eventos del propietario (requiere autenticación)
router.get('/owner', auth, async (req, res) => {
  try {
    const events = await require('../models/Event').find({ entidad: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Las siguientes rutas requieren autenticación
router.use(auth);

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