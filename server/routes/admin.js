const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Proteger todas las rutas de admin
router.use(authMiddleware, adminMiddleware);

// Rutas para gestión de eventos
router.get('/events', adminController.getAllEvents);
router.put('/events/:id/approve', adminController.approveEvent);
router.put('/events/:id/reject', adminController.rejectEvent);
router.put('/events/:id', adminController.updateEvent);

module.exports = router;