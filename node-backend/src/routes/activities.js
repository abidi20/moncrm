// src/routes/activities.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { query } = require('../db');

const router = express.Router();

/**
 * Renvoie un flux unifié d'activités récentes (interactions, messages, notes)
 * Normalisation : { id, type, title, description, time, contact, status }
 */
router.get('/recent', requireAuth, async (_req, res) => {
  try {
    // Remarque: on utilise UNION ALL et on ordonne par time desc
    const { rows } = await query(
      `
      SELECT * FROM (
        -- Interactions (on les marque "scheduled" par défaut)
        SELECT 
          i.id,
          'interaction' AS type,
          COALESCE(i.title, CONCAT('Interaction #', i.id)) AS title,
          NULL AS description,
          i.created_at AS time,
          u.name AS contact,
          'scheduled' AS status
        FROM interactions i
        LEFT JOIN users u ON u.id = i.created_by

        UNION ALL

        -- Messages (status = 'sent')
        SELECT 
          m.id,
          'message' AS type,
          CONCAT('Message dans interaction #', m.interaction_id) AS title,
          LEFT(m.body, 180) AS description,
          m.sent_at AS time,
          u.name AS contact,
          'sent' AS status
        FROM messages m
        LEFT JOIN users u ON u.id = m.sender_id

        UNION ALL

        -- Notes (status = 'noted')
        SELECT 
          n.id,
          'note' AS type,
          CONCAT('Note interaction #', n.interaction_id) AS title,
          LEFT(n.body, 180) AS description,
          n.created_at AS time,
          u.name AS contact,
          'noted' AS status
        FROM notes n
        LEFT JOIN users u ON u.id = n.author_id
      ) AS T
      ORDER BY time DESC
      LIMIT 25
      `
    );

    // Format ISO pour le front et fallback propres
    const items = (rows || []).map(r => ({
      id: r.id,
      type: r.type,                      // 'interaction' | 'message' | 'note'
      title: r.title || '',
      description: r.description || '',
      time: r.time ? new Date(r.time).toISOString() : null,
      contact: r.contact || '—',
      status: r.status,                  // 'scheduled' | 'sent' | 'noted'
    }));

    res.json({ items });
  } catch (e) {
    console.error('activities/recent error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
