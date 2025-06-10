const Event = require('../models/Event');

// Obtener todos los eventos agrupados por estado
const getAllEvents = async (req, res) => {
  try {
    const [pendingEvents, approvedEvents, rejectedEvents] = await Promise.all([
      Event.find({ estado: 'pendiente' }).sort({ fechaCreacion: -1 }).populate('duenioId', 'nombre email'),
      Event.find({ estado: 'aprobado' }).sort({ fechaCreacion: -1 }).populate('duenioId', 'nombre email'),
      Event.find({ estado: 'rechazado' }).sort({ fechaCreacion: -1 }).populate('duenioId', 'nombre email')
    ]);

    res.json({
      pendientes: pendingEvents,
      aprobados: approvedEvents,
      rechazados: rejectedEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
  }
};

// Aprobar un evento
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { estado: 'aprobado' },
      { new: true }
    ).populate('duenioId', 'nombre email');
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar el evento', error: error.message });
  }
};

// Rechazar un evento
const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        estado: 'rechazado',
        motivoRechazo: req.body.motivoRechazo
      },
      { new: true }
    ).populate('duenioId', 'nombre email');
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar el evento', error: error.message });
  }
};

// Editar un evento
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('duenioId', 'nombre email');
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el evento', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  approveEvent,
  rejectEvent,
  updateEvent
};