/**
 * @fileoverview Routes de gestion des réservations (sous-ressource de catway).
 * @module routes/reservations
 */

const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Affiche la liste des réservations d'un catway.
 * @route GET /catways/:id/reservations
 * @param {number} id - Numéro du catway
 * @access Privé
 */
router.get('/:id/reservations', isAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.render('reservations/index', { reservations, catwayId: req.params.id, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de création d'une réservation.
 * @route GET /catways/:id/reservations/new
 * @param {number} id - Numéro du catway
 * @access Privé
 */
router.get('/:id/reservations/new', isAuthenticated, (req, res) => {
  res.render('reservations/new', { catwayId: req.params.id, user: req.session.user, error: null });
});

/**
 * Affiche le détail d'une réservation.
 * @route GET /catways/:id/reservations/:idReservation
 * @param {number} id - Numéro du catway
 * @param {string} idReservation - Identifiant MongoDB de la réservation
 * @access Privé
 */
router.get('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).render('error', { message: 'Réservation non trouvée' });
    res.render('reservations/show', { reservation, catwayId: req.params.id, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de modification d'une réservation.
 * @route GET /catways/:id/reservations/:idReservation/edit
 * @param {number} id - Numéro du catway
 * @param {string} idReservation - Identifiant MongoDB de la réservation
 * @access Privé
 */
router.get('/:id/reservations/:idReservation/edit', isAuthenticated, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).render('error', { message: 'Réservation non trouvée' });
    res.render('reservations/edit', { reservation, catwayId: req.params.id, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Crée une nouvelle réservation pour un catway.
 * @route POST /catways/:id/reservations
 * @param {number} id - Numéro du catway
 * @param {Object} req.body - Données de la réservation (clientName, boatName, startDate, endDate)
 * @access Privé
 */
router.post('/:id/reservations', isAuthenticated, async (req, res) => {
  try {
    const reservation = new Reservation({ ...req.body, catwayNumber: req.params.id });
    await reservation.save();
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.render('reservations/new', { catwayId: req.params.id, user: req.session.user, error: err.message });
  }
});

/**
 * Modifie une réservation existante.
 * @route PUT /catways/:id/reservations/:idReservation
 * @param {number} id - Numéro du catway
 * @param {string} idReservation - Identifiant MongoDB de la réservation
 * @param {Object} req.body - Nouvelles données (clientName, boatName, startDate, endDate)
 * @access Privé
 */
router.put('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.idReservation, req.body);
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    const reservation = await Reservation.findById(req.params.idReservation);
    res.render('reservations/edit', { reservation, catwayId: req.params.id, user: req.session.user, error: err.message });
  }
});

/**
 * Supprime une réservation.
 * @route DELETE /catways/:id/reservations/:idReservation
 * @param {number} id - Numéro du catway
 * @param {string} idReservation - Identifiant MongoDB de la réservation
 * @access Privé
 */
router.delete('/:id/reservations/:idReservation', isAuthenticated, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.idReservation);
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
