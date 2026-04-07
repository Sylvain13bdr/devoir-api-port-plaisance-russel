/**
 * @fileoverview Middleware d'authentification pour protéger les routes privées.
 * @module middleware/auth
 */

/**
 * Vérifie si l'utilisateur est connecté via la session.
 * Redirige vers la page d'accueil si non authentifié.
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @param {import('express').NextFunction} next - Fonction next Express
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/');
};

module.exports = { isAuthenticated };
