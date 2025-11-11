// src/routes/interactions.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');
const rateLimit = require('express-rate-limit');

const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many interactions created, try again later.' },
});

const sanitizeTitle = (title) =>
  typeof title === 'string' ? title.trim().slice(0, 255).replace(/<[^>]*>/g, '') : null;

router.post('/', createLimiter, async (req, res) => {
  if (!req.user?.sub) return res.status(401).json({ error: 'Unauthorized' });

  let { title, champ_id } = req.body ?? {};
  title = sanitizeTitle(title);
  if (!title) return res.status(400).json({ error: 'title is required' });

  if (champ_id !== null && champ_id !== undefined) {
    champ_id = parseInt(champ_id, 10);
    if (isNaN(champ_id)) return res.status(400).json({ error: 'champ_id must be a number' });
  }

  try {
    const { rows: ins } = await query(
      `INSERT INTO interactions (title, champ_id, created_by) VALUES (?, ?, ?)`,
      [title, champ_id ?? null, req.user.sub]
    );
    const interactionId = ins?.insertId;
    if (!interactionId) return res.status(500).json({ error: 'Failed to get inserted ID' });

    const { rows } = await query(`SELECT * FROM interactions WHERE id = ? LIMIT 1`, [interactionId]);
    const interaction = rows[0];
    if (!interaction) return res.status(500).json({ error: 'Failed to retrieve created interaction' });

    await query(
      `INSERT IGNORE INTO interaction_participants (interaction_id, user_id, role_in_interaction) VALUES (?, ?, 'initiator')`,
      [interactionId, req.user.sub]
    );

    res.status(201).json(interaction);
  } catch (e) {
    console.error('Create interaction error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  const { participantId } = req.query;
  try {
    if (participantId !== undefined) {
      const userId = parseInt(participantId, 10);
      if (isNaN(userId)) return res.status(400).json({ error: 'participantId must be a number' });
      const { rows } = await query(
        `SELECT DISTINCT i.* FROM interactions i
         JOIN interaction_participants ip ON ip.interaction_id = i.id
         WHERE ip.user_id = ? ORDER BY i.created_at DESC LIMIT 200`,
        [userId]
      );
      return res.json(rows || []);
    }
    const { rows } = await query(`SELECT * FROM interactions ORDER BY created_at DESC LIMIT 200`);
    res.json(rows || []);
  } catch (e) {
    console.error('List interactions error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const { rows } = await query(`SELECT * FROM interactions WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('Get interaction error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/participants', createLimiter, async (req, res) => {
  const interactionId = parseInt(req.params.id, 10);
  if (isNaN(interactionId)) return res.status(400).json({ error: 'Invalid interaction ID' });

  let { user_id, role_in_interaction } = req.body ?? {};
  if (user_id === undefined || user_id === null) return res.status(400).json({ error: 'user_id required' });

  user_id = parseInt(user_id, 10);
  if (isNaN(user_id)) return res.status(400).json({ error: 'user_id must be a number' });

  const { rows: exist } = await query(`SELECT 1 FROM interactions WHERE id = ? LIMIT 1`, [interactionId]);
  if (!exist[0]) return res.status(404).json({ error: 'Interaction not found' });

  try {
    await query(
      `INSERT IGNORE INTO interaction_participants (interaction_id, user_id, role_in_interaction) VALUES (?, ?, ?)`,
      [interactionId, user_id, role_in_interaction || null]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error('Add participant error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
