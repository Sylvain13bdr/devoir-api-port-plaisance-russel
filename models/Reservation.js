/**
 * @fileoverview Modèle Mongoose pour les réservations de catways.
 * @module models/Reservation
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client ayant effectué la réservation
 * @property {string} boatName - Nom du bateau amarré
 * @property {Date} startDate - Date de début de la réservation
 * @property {Date} endDate - Date de fin de la réservation
 */
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
