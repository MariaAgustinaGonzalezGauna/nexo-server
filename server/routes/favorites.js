const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

// Agregar evento a favoritos
router.post('/:userId/favorites/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ error: 'User or Event not found' });
    }

    if (user.favorites && user.favorites.includes(eventId)) {
      return res.status(400).json({ error: 'Event already in favorites' });
    }

    user.favorites = user.favorites || [];
    user.favorites.push(eventId);
    await user.save();

    res.json({ message: 'Event added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Obtener eventos favoritos del usuario
router.get('/:userId/favorites', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Eliminar evento de favoritos
router.delete('/:userId/favorites/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ error: 'User or Event not found' });
    }

    if (!user.favorites || !user.favorites.includes(eventId)) {
      return res.status(400).json({ error: 'Event not in favorites' });
    }

    user.favorites = user.favorites.filter(favId => favId.toString() !== eventId);
    await user.save();

    res.json({ message: 'Event removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;