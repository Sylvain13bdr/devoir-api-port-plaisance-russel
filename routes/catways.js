/**
 * @fileoverview Routes de gestion des catways.
 * @module routes/catways
 */

const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Affiche la liste de tous les catways triés par numéro.
 * @route GET /catways
 * @access Privé
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways/index', { catways, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de création d'un catway.
 * @route GET /catways/new
 * @access Privé
 */
router.get('/new', isAuthenticated, (req, res) => {
  res.render('catways/new', { user: req.session.user, error: null });
});

/**
 * Affiche le détail d'un catway par son numéro.
 * @route GET /catways/:id
 * @param {number} id - Numéro du catway
 * @access Privé
 */
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    res.render('catways/show', { catway, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de modification d'un catway.
 * @route GET /catways/:id/edit
 * @param {number} id - Numéro du catway
 * @access Privé
 */
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    res.render('catways/edit', { catway, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Crée un nouveau catway.
 * @route POST /catways
 * @param {Object} req.body - Données du catway (catwayNumber, catwayType, catwayState)
 * @access Privé
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.redirect('/catways');
  } catch (err) {
    res.render('catways/new', { user: req.session.user, error: err.message });
  }
});

/**
 * Modifie l'état d'un catway (seul catwayState est modifiable).
 * Le numéro et le type ne peuvent pas être modifiés.
 * @route PUT /catways/:id
 * @param {number} id - Numéro du catway
 * @param {string} req.body.catwayState - Nouvel état du catway
 * @access Privé
 */
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    catway.catwayState = req.body.catwayState;
    await catway.save();
    res.redirect('/catways');
  } catch (err) {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    res.render('catways/edit', { catway, user: req.session.user, error: err.message });
  }
});

/**
 * Supprime un catway par son numéro.
 * @route DELETE /catways/:id
 * @param {number} id - Numéro du catway
 * @access Privé
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    res.redirect('/catways');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
