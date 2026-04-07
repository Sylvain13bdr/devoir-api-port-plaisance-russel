/**
 * @fileoverview Routes d'authentification (connexion et déconnexion).
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * Connecte un utilisateur avec son email et mot de passe.
 * En cas de succès, stocke les informations en session et redirige vers le tableau de bord.
 * @route POST /login
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.error = 'Email ou mot de passe incorrect';
      return res.redirect('/');
    }
    req.session.userId = user._id;
    req.session.user = { username: user.username, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    req.session.error = 'Erreur lors de la connexion';
    res.redirect('/');
  }
});

/**
 * Déconnecte l'utilisateur en détruisant la session et redirige vers la page d'accueil.
 * @route GET /logout
 * @access Privé
 */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
