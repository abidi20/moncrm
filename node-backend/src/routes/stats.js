// src/routes/stats.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.get('/stats', async (_req, res) => {
  try {
    const { rows: contacts } = await query('SELECT COUNT(*) AS total FROM contacts');
    const { rows: interactions } = await query(
      "SELECT COUNT(*) AS total FROM interactions WHERE MONTH(date) = MONTH(NOW())"
    );
    const { rows: opportunites } = await query(
      "SELECT COUNT(*) AS total FROM opportunites WHERE statut = 'active'"
    );

    const tauxConversion = 18.2;

    res.json({
      totalContacts: contacts[0]?.total ?? 0,
      interactionsMois: interactions[0]?.total ?? 0,
      opportunitesActives: opportunites[0]?.total ?? 0,
      tauxConversion,
    });
  } catch (err) {
    console.error('Erreur /api/stats :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
