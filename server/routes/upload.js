const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Ruta para subir imagen
router.post('/', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

module.exports = router; 