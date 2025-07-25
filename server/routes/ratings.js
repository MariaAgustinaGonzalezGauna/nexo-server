const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

// Puntuar un evento (requiere autenticación)
router.post('/evento/:eventoId', auth, ratingController.puntuarEvento);

// Obtener puntuación del usuario para un evento específico (requiere autenticación)
router.get('/evento/:eventoId/usuario', auth, ratingController.obtenerPuntuacionUsuario);

// Obtener estadísticas de puntuación de un evento (público)
router.get('/evento/:eventoId/estadisticas', ratingController.obtenerEstadisticasEvento);

module.exports = router; 