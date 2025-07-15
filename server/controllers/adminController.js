const Event = require('../models/Event');
const User = require('../models/User');
const transporter = require('../config/mailer');

// Obtener todos los eventos agrupados por estado
const getAllEvents = async (req, res) => {
  try {
    const [pendingEvents, approvedEvents, rejectedEvents] = await Promise.all([
      Event.find({ estado: 'pendiente' }).sort({ fechaCreacion: -1 }).populate('entidad', 'nombre email'),
      Event.find({ estado: 'aprobado' }).sort({ fechaCreacion: -1 }).populate('entidad', 'nombre email'),
      Event.find({ estado: 'rechazado' }).sort({ fechaCreacion: -1 }).populate('entidad', 'nombre email')
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
    ).populate('entidad', 'nombre email');

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Buscar todos los usuarios
    const usuarios = await User.find({});
    
    // Enviar email a cada usuario
    for (const user of usuarios) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: `¡Nuevo evento: ${event.nombre}!`,
        html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
    <h2>Nuevo evento que te puede interesar:</h2>
    <h3>${event.nombre}</h3>
    <p><strong>Fecha:</strong> ${event.fecha}</p>
    <p><strong>Hora:</strong> ${event.hora}</p>
    <p><strong>Lugar:</strong> ${event.lugar}</p>
    <p>${event.descripcion}</p>
    <img src="${event.imagenUrl}" alt="Imagen del evento" style="max-width: 100%; height: auto; margin-top: 10px;" />
    <div style="margin-top: 20px;">
      <a href="http://localhost:3000/eventos/${event._id}" style="
        display: inline-block;
        padding: 12px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      ">Ver Evento</a>
    </div>
  </div>
`
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Evento aprobado y correos enviados', event });

  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar el evento o enviar correos', error: error.message });
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
    ).populate('entidad', 'nombre email');
    
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
    ).populate('entidad', 'nombre email');
    
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