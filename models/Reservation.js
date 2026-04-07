const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est requis']
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est requis'],
    trim: true
  },
  boatName: {
    type: String,
    required: [true, 'Le nom du bateau est requis'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
