/**
 * @fileoverview Modèle Mongoose pour les utilisateurs de la capitainerie.
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Adresse email unique
 * @property {string} password - Mot de passe hashé (min. 6 caractères)
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, { timestamps: true });

/**
 * Hook pré-sauvegarde : hash le mot de passe si modifié.
 */
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare un mot de passe en clair avec le hash stocké.
 * @param {string} candidatePassword - Mot de passe à vérifier
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
