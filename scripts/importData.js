require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

const catways = [
  { catwayNumber: 1, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 2, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 3, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 4, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 5, catwayType: 'long', catwayState: 'bon état' },
  { catwayNumber: 6, catwayType: 'short', catwayState: 'En cours de réparation. Ne peut être réservée actuellement' },
  { catwayNumber: 7, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 8, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 9, catwayType: 'long', catwayState: 'Plusieurs grandes tâches de peinture bleue sur le ponton' },
  { catwayNumber: 10, catwayType: 'long', catwayState: 'bon état' },
  { catwayNumber: 11, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 12, catwayType: 'short', catwayState: 'grosse tâche d\'huile et trou en fin de ponton' },
  { catwayNumber: 13, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 14, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 15, catwayType: 'long', catwayState: 'bon état' },
  { catwayNumber: 16, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 17, catwayType: 'short', catwayState: '2 planches bougent lorsqu\'on marche dessus' },
  { catwayNumber: 18, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 19, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 20, catwayType: 'long', catwayState: 'bon état' },
  { catwayNumber: 21, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 22, catwayType: 'short', catwayState: 'bon état' },
  { catwayNumber: 23, catwayType: 'short', catwayState: 'La bite d\'amarrage est légèrement désolidarisée' },
  { catwayNumber: 24, catwayType: 'short', catwayState: 'bon état' }
];

const reservations = [
  { catwayNumber: 1, clientName: 'Thomas Martin', boatName: 'Carolina', startDate: '2024-05-21T06:00:00Z', endDate: '2024-10-27T06:00:00Z' },
  { catwayNumber: 2, clientName: 'John Doe', boatName: 'Groeland', startDate: '2024-05-18T06:00:00Z', endDate: '2024-11-30T06:00:00Z' },
  { catwayNumber: 3, clientName: 'Margareth Wurtz', boatName: 'Sirène', startDate: '2024-06-20T06:00:00Z', endDate: '2024-08-27T06:00:00Z' },
  { catwayNumber: 7, clientName: 'Ralph Laurent', boatName: 'Surcouf', startDate: '2024-07-01T06:00:00Z', endDate: '2024-10-13T06:00:00Z' },
  { catwayNumber: 11, clientName: 'Jack Sparrow', boatName: 'Black perl', startDate: '2024-08-13T06:00:00Z', endDate: '2024-09-13T06:00:00Z' },
  { catwayNumber: 13, clientName: 'Jacky Snow', boatName: 'Léandra', startDate: '2024-09-18T06:00:00Z', endDate: '2024-12-23T06:00:00Z' }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);
    console.log('✓ 24 catways importés');
    console.log('✓ 6 réservations importées');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur :', err);
    process.exit(1);
  });
