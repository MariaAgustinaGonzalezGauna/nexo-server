const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const entityRoutes = require('./routes/entities');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL del frontend
  credentials: true // Permitir cookies y headers de autenticación
}));

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mariaagussag:oID72ElSlE9jQ9Xw@nexodb.ahwqx1p.mongodb.net/nexo-db')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/entities', entityRoutes);
app.use(require('./routes/favorites')); // <-- esto está bien aunque VS Code lo marque rojo
app.use(require('./routes/comments'));

app.get('/', (req, res) => {
  res.send('NEXO API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
