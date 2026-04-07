require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const existing = await User.findOne({ email: 'admin@port-russell.fr' });
    if (existing) {
      console.log('L\'utilisateur admin existe déjà.');
      process.exit(0);
    }
    const admin = new User({
      username: 'Admin',
      email: 'admin@port-russell.fr',
      password: 'admin123'
    });
    await admin.save();
    console.log('Utilisateur admin créé :');
    console.log('  Email    : admin@port-russell.fr');
    console.log('  Password : admin123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur :', err);
    process.exit(1);
  });
