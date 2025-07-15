const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const {
  getEntities,
  createEntity,
  getEntityById,
  updateEntity,
  deleteEntity
} = require('../controllers/entityController');

// Obtener todas las entidades (requiere autenticación)
router.get('/', async (req, res) => {
  try {
    const entities = await getEntities();
    
    res.json(entities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una entidad específica (público)
router.get('/:id', async (req, res) => {
  try {
    const entity = await getEntityById(req.params.id);
    res.json(entity);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Las siguientes rutas requieren autenticación
router.use(auth);

// Crear una nueva entidad (solo administradores y dueños)
router.post('/', checkRole([1, 2]), async (req, res) => {
  try {
    const newEntity = await createEntity(req.body, req.user.id, req.user.tipo);
    res.status(201).json(newEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una entidad (solo administradores y dueños)
router.put('/:id', checkRole([1, 2]), async (req, res) => {
  try {
    const updatedEntity = await updateEntity(
      req.params.id,
      req.body,
      req.user.id,
      req.user.tipo
    );
    res.json(updatedEntity);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Eliminar una entidad (solo administradores y dueños)
router.delete('/:id', checkRole([1, 2]), async (req, res) => {
  try {
    const result = await deleteEntity(
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