require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

const listAllEvents = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mariaagussag:oID72ElSlE9jQ9Xw@nexodb.ahwqx1p.mongodb.net/nexo-db');
    console.log('Conexión exitosa\n');

    console.log('Buscando todos los eventos...\n');
    const allEvents = await Event.find()
      .populate('duenioId', 'nombre email')
      .lean();

    if (allEvents.length === 0) {
      console.log('No hay eventos en la base de datos.');
      return;
    }

    // Agrupar eventos por estado
    const eventsByStatus = allEvents.reduce((acc, event) => {
      const status = event.estado || 'sin_estado';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(event);
      return acc;
    }, {});

    // Mostrar resumen
    console.log('=== RESUMEN DE EVENTOS ===');
    Object.keys(eventsByStatus).forEach(status => {
      console.log(`${status}: ${eventsByStatus[status].length} eventos`);
    });
    console.log('========================\n');

    // Mostrar detalles por estado
    Object.keys(eventsByStatus).forEach(status => {
      console.log(`\n=== EVENTOS ${status.toUpperCase()} ===`);
      eventsByStatus[status].forEach((event, index) => {
        console.log(`\nEvento ${index + 1}:`);
        console.log('Título:', event.nombre);
        console.log('Descripción:', event.descripcion);
        console.log('Fecha:', event.fecha);
        console.log('Hora:', event.hora);
        console.log('Lugar:', event.lugar);
        console.log('Tipo:', event.tipo);
        console.log('Dueño:', event.duenioId ? `${event.duenioId.nombre} (${event.duenioId.email})` : 'No especificado');
        console.log('Estado:', event.estado);
        console.log('ID:', event._id);
        console.log('-------------------');
      });
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  }
};

listAllEvents(); 