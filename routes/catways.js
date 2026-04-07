const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../middleware/auth');

// GET /catways - Liste tous les catways
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways/index', { catways, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /catways/new - Formulaire de création
router.get('/new', isAuthenticated, (req, res) => {
  res.render('catways/new', { user: req.session.user, error: null });
});

// GET /catways/:id - Détail d'un catway
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    res.render('catways/show', { catway, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /catways/:id/edit - Formulaire de modification
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    res.render('catways/edit', { catway, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// POST /catways - Créer un catway
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.redirect('/catways');
  } catch (err) {
    res.render('catways/new', { user: req.session.user, error: err.message });
  }
});

// PUT /catways/:id - Modifier l'état d'un catway
router.post('/:id/update', isAuthenticated, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).render('error', { message: 'Catway non trouvé' });
    catway.catwayState = req.body.catwayState;
    await catway.save();
    res.redirect('/catways');
  } catch (err) {
    res.render('catways/edit', { catway: req.body, user: req.session.user, error: err.message });
  }
});

// DELETE /catways/:id - Supprimer un catway
router.post('/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    res.redirect('/catways');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
