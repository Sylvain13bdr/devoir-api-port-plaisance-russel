const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET / - Page d'accueil
router.get('/', (req, res) => {
  const error = req.session.error || null;
  req.session.error = null;
  res.render('index', { error });
});

// POST /login - Connexion
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

// GET /logout - Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
