const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// GET /users/ - Liste tous les utilisateurs
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users/index', { users, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /users/new - Formulaire de création
router.get('/new', isAuthenticated, (req, res) => {
  res.render('users/new', { user: req.session.user, error: null });
});

// GET /users/:email - Détail d'un utilisateur
router.get('/:email', isAuthenticated, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email }).select('-password');
    if (!foundUser) return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
    res.render('users/show', { foundUser, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// GET /users/:email/edit - Formulaire de modification
router.get('/:email/edit', isAuthenticated, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email }).select('-password');
    if (!foundUser) return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
    res.render('users/edit', { foundUser, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// POST /users/ - Créer un utilisateur
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    res.render('users/new', { user: req.session.user, error: err.message });
  }
});

// PUT /users/:email - Modifier un utilisateur
router.put('/:email', isAuthenticated, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const foundUser = await User.findOne({ email: req.params.email });
    if (!foundUser) return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
    foundUser.username = username;
    foundUser.email = email;
    if (password && password.trim() !== '') {
      foundUser.password = password;
    }
    await foundUser.save();
    res.redirect('/users');
  } catch (err) {
    const foundUser = await User.findOne({ email: req.params.email }).select('-password');
    res.render('users/edit', { foundUser, user: req.session.user, error: err.message });
  }
});

// DELETE /users/:email - Supprimer un utilisateur
router.delete('/:email', isAuthenticated, async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.redirect('/users');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
