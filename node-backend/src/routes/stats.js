// src/routes/stats.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');
// (optionnel mais conseillé)
// const { requireAuth } = require('../middleware/auth');

router.get('/', async (_req, res) => {
  try {
    // 1) Nombre total de contacts
    const { rows: contacts } = await query(
      'SELECT COUNT(*) AS total FROM contacts'
    );
    const totalContacts = contacts[0]?.total ?? 0;

    // 2) Nombre d’interactions du mois courant
    // On utilise scheduled_at si présent, sinon created_at
    const { rows: interactions } = await query(
      `SELECT COUNT(*) AS total
         FROM interactions
        WHERE MONTH(COALESCE(scheduled_at, created_at)) = MONTH(CURDATE())
          AND YEAR(COALESCE(scheduled_at, created_at)) = YEAR(CURDATE())`
    );
    const interactionsMois = interactions[0]?.total ?? 0;

    // 3) Pour l’instant, pas de table "opportunites"
    const opportunitesActives = 0;

    const tauxConversion = 18.2; // valeur fixe pour le moment

    return res.json({
      totalContacts,
      interactionsMois,
      opportunitesActives,
      tauxConversion,
    });
  } catch (err) {
    console.error('Erreur /api/stats :', err);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
