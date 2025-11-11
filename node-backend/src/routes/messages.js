// src/routes/messages.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { query } = require('../db');
const rateLimit = require('express-rate-limit');

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent, please slow down.' },
  keyGenerator: (req) => (req.user && req.user.sub ? `u:${req.user.sub}` : req.ip),
});

const sanitizeBody = (body) => {
  if (typeof body !== 'string') return null;
  const trimmed = body.trim();
  if (!trimmed) return null;
  return trimmed.replace(/<[^>]*>/g, '').slice(0, 5000);
};

router.get('/:id/messages', async (req, res) => {
  const interactionId = parseInt(req.params.id, 10);
  if (isNaN(interactionId)) return res.status(400).json({ error: 'Invalid interaction ID' });

  try {
    if (req.user?.sub) {
      const { rows: access } = await query(
        `SELECT 1 FROM interaction_participants WHERE interaction_id = ? AND user_id = ? LIMIT 1`,
        [interactionId, req.user.sub]
      );
      if (!access[0]) return res.status(403).json({ error: 'Access denied to this interaction' });
    }

    const { rows } = await query(
      `SELECT m.id, m.interaction_id, m.sender_id, u.name AS sender_name, m.body, m.sent_at, m.read_at
         FROM messages m
         JOIN users u ON u.id = m.sender_id
        WHERE m.interaction_id = ?
        ORDER BY m.sent_at ASC
        LIMIT 1000`,
      [interactionId]
    );

    res.json(rows || []);
  } catch (e) {
    console.error('Get messages error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/messages', messageLimiter, async (req, res) => {
  const interactionId = parseInt(req.params.id, 10);
  if (isNaN(interactionId)) return res.status(400).json({ error: 'Invalid interaction ID' });
  if (!req.user?.sub) return res.status(401).json({ error: 'Unauthorized' });

  let { body } = req.body ?? {};
  body = sanitizeBody(body);
  if (!body) return res.status(400).json({ error: 'Message body is required and cannot be empty' });

  try {
    const { rows: interactionCheck } = await query(`SELECT 1 FROM interactions WHERE id = ? LIMIT 1`, [interactionId]);
    if (!interactionCheck[0]) return res.status(404).json({ error: 'Interaction not found' });

    const { rows: participantCheck } = await query(
      `SELECT 1 FROM interaction_participants WHERE interaction_id = ? AND user_id = ? LIMIT 1`,
      [interactionId, req.user.sub]
    );
    if (!participantCheck[0]) return res.status(403).json({ error: 'You are not a participant in this interaction' });

    const { rows: result } = await query(
      `INSERT INTO messages (interaction_id, sender_id, body) VALUES (?, ?, ?)`,
      [interactionId, req.user.sub, body]
    );
    const messageId = result?.insertId;
    if (!messageId) throw new Error('Failed to insert message');

    const { rows } = await query(
      `SELECT m.id, m.interaction_id, m.sender_id, u.name AS sender_name, m.body, m.sent_at
         FROM messages m
         JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
        LIMIT 1`,
      [messageId]
    );

    const newMessage = rows[0];
    if (!newMessage) return res.status(500).json({ error: 'Failed to retrieve sent message' });
    res.status(201).json(newMessage);
  } catch (e) {
    console.error('Send message error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
