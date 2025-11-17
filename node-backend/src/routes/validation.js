// src/utils/validation.js

/**
 * Nettoie le nom pour éviter les caractères ou balises HTML indésirables.
 */
function sanitizeName(name) {
  if (typeof name !== 'string') return '';
  return name.trim().replace(/<[^>]*>/g, '').slice(0, 50);
}

/**
 * Vérifie le format d’un email.
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

module.exports = {
  sanitizeName,
  isValidEmail,
};
