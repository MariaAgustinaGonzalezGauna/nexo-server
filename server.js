const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
const eventsRoutes = require('./routes/events');
const path = require('path');

// ...código existente arriba...
app.use('/api/upload', uploadRoutes);
app.use('/api/events', eventsRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// ...código existente abajo... 