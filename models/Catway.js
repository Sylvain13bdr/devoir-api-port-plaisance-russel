/**
 * @fileoverview Modèle Mongoose pour les catways du port de plaisance.
 * @module models/Catway
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du catway
 * @property {string} catwayType - Type du catway : "long" ou "short"
 * @property {string} catwayState - Description de l'état du catway
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est requis'],
    unique: true
  },
  catwayType: {
    type: String,
    required: [true, 'Le type de catway est requis'],
    enum: ['long', 'short']
  },
  catwayState: {
    type: String,
    required: [true, 'L\'état du catway est requis'],
    default: 'bon état'
  }
}, { timestamps: true });

module.exports = mongoose.model('Catway', catwaySchema);
