const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../middleware/auth');

// GET /catways/:id/reservations - Liste des réservations d'un catway
router.get('/:id/reservations', isAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.render('reservations/index', { reservations, catwayId: req.params.id, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /catways/:id/reservations/new - Formulaire de création
router.get('/:id/reservations/new', isAuthenticated, (req, res) => {
  res.render('reservations/new', { catwayId: req.params.id, user: req.session.user, error: null });
});

// GET /catways/:id/reservations/:idReservation - Détail d'une réservation
router.get('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).render('error', { message: 'Réservation non trouvée' });
    res.render('reservations/show', { reservation, catwayId: req.params.id, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /catways/:id/reservations/:idReservation/edit - Formulaire de modification
router.get('/:id/reservations/:idReservation/edit', isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).render('error', { message: 'Réservation non trouvée' });
    res.render('reservations/edit', { reservation, catwayId: req.params.id, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// POST /catways/:id/reservations - Créer une réservation
router.post('/:id/reservations', isAuthenticated, async (req, res) => {
  try {
    const reservation = new Reservation({ ...req.body, catwayNumber: req.params.id });
    await reservation.save();
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.render('reservations/new', { catwayId: req.params.id, user: req.session.user, error: err.message });
  }
});

// PUT /catways/:id/reservations - Modifier une réservation
router.put('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.idReservation, req.body);
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    const reservation = await Reservation.findById(req.params.idReservation);
    res.render('reservations/edit', { reservation, catwayId: req.params.id, user: req.session.user, error: err.message });
  }
});

// DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
router.delete('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.idReservation);
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
