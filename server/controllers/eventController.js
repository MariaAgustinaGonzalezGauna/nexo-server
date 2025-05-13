const Event = require('../models/Event');
const User = require('../models/User');

// Verificar si el usuario puede modificar el evento
const canModifyEvent = async (userId, userType) => {
  // Administradores pueden modificar cualquier evento
  if (userType === 1) return true;
  
  // Dueños solo pueden modificar sus propios eventos
  if (userType === 2) {
    const user = await User.findById(userId);
    return user && user.tipo === 2;
  }
  
  return false;
};

// Validar formato de fecha (dd/mm/aaaa)
const isValidDate = (dateStr) => {
  if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/.test(dateStr)) {
    return false;
  }

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getDate() === day &&
         date.getMonth() === month - 1 &&
         date.getFullYear() === year;
};

// Validar formato de hora (hh:mm)
const isValidTime = (timeStr) => {
  if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
    return false;
  }
  return true;
};

// Validar que la fecha y hora no sean pasadas
const isFutureDateTime = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const eventDate = new Date(year, month - 1, day, hours, minutes);
  return eventDate > new Date();
};

// Validar datos del evento
const validateEventData = (eventData) => {
  const errors = [];

  if (!eventData.nombre || eventData.nombre.trim().length < 3) {
    errors.push('El nombre del evento debe tener al menos 3 caracteres');
  }

  if (!eventData.descripcion || eventData.descripcion.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  if (!eventData.lugar || eventData.lugar.trim().length < 3) {
    errors.push('El lugar debe tener al menos 3 caracteres');
  }

  if (!eventData.imagenUrl || !eventData.imagenUrl.match(/^https?:\/\/.+/)) {
    errors.push('La URL de la imagen debe ser válida y comenzar con http:// o https://');
  }

  if (!eventData.fecha || !isValidDate(eventData.fecha)) {
    errors.push('La fecha debe tener el formato dd/mm/aaaa');
  }

  if (!eventData.hora || !isValidTime(eventData.hora)) {
    errors.push('La hora debe tener el formato hh:mm (24 horas)');
  }

  if (eventData.fecha && eventData.hora && !isFutureDateTime(eventData.fecha, eventData.hora)) {
    errors.push('La fecha y hora del evento deben ser futuras');
  }

  if (!eventData.informacion || eventData.informacion.trim().length < 10) {
    errors.push('La información del evento debe tener al menos 10 caracteres');
  }

  if (!eventData.tipo || eventData.tipo.trim().length < 3) {
    errors.push('El tipo de evento debe tener al menos 3 caracteres');
  }

  return errors;
};

// Obtener todos los eventos
const getEvents = async () => {
  return await Event.find().populate('duenioId', 'nombre email');
};

// Crear un nuevo evento
const createEvent = async (eventData, userId, userType) => {
  // Validar datos del evento
  const validationErrors = validateEventData(eventData);
  if (validationErrors.length > 0) {
    throw new Error('Errores de validación: ' + validationErrors.join(', '));
  }

  // Manejar el duenioId según el tipo de usuario
  if (userType === 2) {
    // Si es dueño, asignar su ID
    eventData.duenioId = userId;
  } else if (userType === 1) {
    // Si es administrador, el duenioId será undefined/null
    delete eventData.duenioId;
  }
  
  const event = new Event(eventData);
  const newEvent = await event.save();
  return await newEvent.populate('duenioId', 'nombre email');
};

// Obtener un evento específico
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate('duenioId', 'nombre email');
  if (!event) {
    throw new Error('Evento no encontrado');
  }
  return event;
};

// Actualizar un evento
const updateEvent = async (eventId, updateData, userId, userType) => {
  // Validar datos del evento si se están actualizando campos relevantes
  if (Object.keys(updateData).some(key => 
    ['nombre', 'descripcion', 'lugar', 'imagenUrl', 'fecha', 'hora', 'informacion', 'tipo'].includes(key))) {
    const validationErrors = validateEventData({ 
      ...await getEventById(eventId), // Obtener datos actuales
      ...updateData // Sobrescribir con datos nuevos
    });
    if (validationErrors.length > 0) {
      throw new Error('Errores de validación: ' + validationErrors.join(', '));
    }
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Evento no encontrado');
  }

  // Verificar permisos
  if (userType === 2 && event.duenioId && event.duenioId.toString() !== userId) {
    throw new Error('No tienes permiso para modificar este evento');
  }

  Object.assign(event, updateData);
  const updatedEvent = await event.save();
  return await updatedEvent.populate('duenioId', 'nombre email');
};

// Eliminar un evento
const deleteEvent = async (eventId, userId, userType) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Evento no encontrado');
  }

  // Verificar permisos
  if (userType === 2 && event.duenioId && event.duenioId.toString() !== userId) {
    throw new Error('No tienes permiso para eliminar este evento');
  }

  await event.deleteOne();
  return { message: 'Evento eliminado' };
};

module.exports = {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
}; 