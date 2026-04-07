/**
 * @fileoverview Routes de gestion des utilisateurs.
 * @module routes/users
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

/**
 * Affiche la liste de tous les utilisateurs (mot de passe exclu).
 * @route GET /users/
 * @access Privé
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users/index', { users, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de création d'un utilisateur.
 * @route GET /users/new
 * @access Privé
 */
router.get('/new', isAuthenticated, (req, res) => {
  res.render('users/new', { user: req.session.user, error: null });
});

/**
 * Affiche le détail d'un utilisateur par son email.
 * @route GET /users/:email
 * @param {string} email - Adresse email de l'utilisateur
 * @access Privé
 */
router.get('/:email', isAuthenticated, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email }).select('-password');
    if (!foundUser) return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
    res.render('users/show', { foundUser, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Affiche le formulaire de modification d'un utilisateur.
 * @route GET /users/:email/edit
 * @param {string} email - Adresse email de l'utilisateur
 * @access Privé
 */
router.get('/:email/edit', isAuthenticated, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.params.email }).select('-password');
    if (!foundUser) return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
    res.render('users/edit', { foundUser, user: req.session.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Crée un nouvel utilisateur.
 * @route POST /users/
 * @param {Object} req.body - Données de l'utilisateur (username, email, password)
 * @access Privé
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    res.render('users/new', { user: req.session.user, error: err.message });
  }
});

/**
 * Modifie les informations d'un utilisateur.
 * Si le mot de passe est fourni, il est mis à jour et re-hashé.
 * @route PUT /users/:email
 * @param {string} email - Adresse email actuelle de l'utilisateur
 * @param {Object} req.body - Nouvelles données (username, email, password optionnel)
 * @access Privé
 */
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

/**
 * Supprime un utilisateur par son email.
 * @route DELETE /users/:email
 * @param {string} email - Adresse email de l'utilisateur
 * @access Privé
 */
router.delete('/:email', isAuthenticated, async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.redirect('/users');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;
