const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EventComment = require('../models/Comments'); // Ajusta el path si es necesario

// POST /api/comments
router.post('/', async (req, res) => {
    try {
        const { usuario, evento, comentario, fecha, calificacion } = req.body;

        // Validación básica
        if (!usuario || !evento || !fecha || !calificacion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        const newComment = new EventComment({
            usuario,
            evento,
            comentario,
            fecha,
            calificacion
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ...existing code...

// DELETE /api/comments/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedComment = await EventComment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }
        res.json({ message: 'Comentario eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/comments/:id
router.put('/:id', async (req, res) => {
    try {
        const { comentario, calificacion } = req.body;
        const updatedFields = {};
        if (comentario !== undefined) updatedFields.comentario = comentario;
        if (calificacion !== undefined) updatedFields.calificacion = calificacion;

        const updatedComment = await EventComment.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...existing code...
// ...existing code...

// GET /api/comments
router.get('/', async (req, res) => {
    try {
        const comments = await EventComment.find()
            .populate('usuario', 'nombre email') // Ajusta los campos según tu modelo de usuario
            .populate('evento', 'nombre');      // Ajusta los campos según tu modelo de evento
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...existing code...


module.exports = router;