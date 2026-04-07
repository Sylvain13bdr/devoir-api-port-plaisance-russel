/**
 * @fileoverview Point d'entrée de l'application - Port de Plaisance Russell.
 * Configure Express, la connexion MongoDB, les middlewares et les routes.
 * @module app
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

/**
 * Connexion à la base de données MongoDB via Mongoose.
 */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB :', err));

// Moteur de vues EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Importation des routes
const authRoutes = require('./routes/auth');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const { isAuthenticated } = require('./middleware/auth');
const Reservation = require('./models/Reservation');

/**
 * Page d'accueil — affiche le formulaire de connexion.
 * @route GET /
 * @access Public
 */
app.get('/', (req, res) => {
  const error = req.session.error || null;
  req.session.error = null;
  res.render('index', { error });
});

app.use('/', authRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes);
app.use('/users', userRoutes);

/**
 * Tableau de bord — affiche les réservations en cours, le nom et l'email de l'utilisateur connecté.
 * @route GET /dashboard
 * @access Privé
 */
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    res.render('dashboard', { user: req.session.user, reservations });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Page de gestion des réservations — liste les catways pour accéder à leurs réservations.
 * @route GET /reservations
 * @access Privé
 */
app.get('/reservations', isAuthenticated, async (req, res) => {
  try {
    const Catway = require('./models/Catway');
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('reservations/all', { catways, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

/**
 * Documentation de l'API.
 * @route GET /api-docs
 * @access Public
 */
app.get('/api-docs', (req, res) => {
  res.render('api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
