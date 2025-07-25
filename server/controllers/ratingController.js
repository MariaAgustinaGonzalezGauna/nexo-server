const Event = require('../models/Event');
const EventRating = require('../models/EventRating');

// Puntuar un evento
exports.puntuarEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { puntuacion } = req.body;
    const usuarioId = req.user.id;

    // Validar que la puntuación esté entre 1 y 5
    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: 'La puntuación debe estar entre 1 y 5' });
    }

    // Verificar que el evento existe
    const evento = await Event.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Buscar si ya existe una puntuación del usuario para este evento
    let eventRating = await EventRating.findOne({ evento: eventoId, usuario: usuarioId });

    if (eventRating) {
      // Actualizar puntuación existente
      const puntuacionAnterior = eventRating.puntuacion;
      eventRating.puntuacion = puntuacion;
      await eventRating.save();

      // Actualizar estadísticas del evento
      evento.puntuacionTotal = evento.puntuacionTotal - puntuacionAnterior + puntuacion;
      await evento.save();
    } else {
      // Crear nueva puntuación
      eventRating = new EventRating({
        evento: eventoId,
        usuario: usuarioId,
        puntuacion: puntuacion
      });
      await eventRating.save();

      // Actualizar estadísticas del evento
      evento.puntuacionTotal += puntuacion;
      evento.cantidadPuntuaciones += 1;
      await evento.save();
    }

    res.json({
      message: 'Puntuación guardada exitosamente',
      puntuacionPromedio: evento.puntuacionPromedio,
      cantidadPuntuaciones: evento.cantidadPuntuaciones
    });

  } catch (error) {
    console.error('Error al puntuar evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener puntuación del usuario para un evento específico
exports.obtenerPuntuacionUsuario = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const usuarioId = req.user.id;

    const eventRating = await EventRating.findOne({ evento: eventoId, usuario: usuarioId });
    
    res.json({
      puntuacion: eventRating ? eventRating.puntuacion : 0
    });

  } catch (error) {
    console.error('Error al obtener puntuación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de puntuación de un evento
exports.obtenerEstadisticasEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const evento = await Event.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json({
      puntuacionPromedio: evento.puntuacionPromedio,
      cantidadPuntuaciones: evento.cantidadPuntuaciones,
      puntuacionTotal: evento.puntuacionTotal
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 