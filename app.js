require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB :', err));

// Moteur de vues
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

// Routes
const authRoutes = require('./routes/auth');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const { isAuthenticated } = require('./middleware/auth');
const Reservation = require('./models/Reservation');

// Page d'accueil
app.get('/', (req, res) => {
  const error = req.session.error || null;
  req.session.error = null;
  res.render('index', { error });
});

app.use('/', authRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes);
app.use('/users', userRoutes);

// Tableau de bord
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

// Page réservations globale (redirige vers les catways)
app.get('/reservations', isAuthenticated, async (req, res) => {
  try {
    const Catway = require('./models/Catway');
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('reservations/all', { catways, user: req.session.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Documentation API
app.get('/api-docs', (req, res) => {
  res.render('api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
