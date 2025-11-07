import { Router } from 'express';
import { query } from '../db.js';

const router = Router({ mergeParams: true });

router.get('/:id/messages', async (req, res) => {
  const { rows } = await query(
    `SELECT m.id, m.interaction_id, m.sender_id, u.name as sender_name, m.body, m.sent_at, m.read_at
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE interaction_id = $1
     ORDER BY sent_at ASC`,
    [req.params.id]
  );
  res.json(rows);
});

router.post('/:id/messages', async (req, res) => {
  const { body } = req.body || {};
  if (!body) return res.status(400).json({ error: 'body required' });
  const { rows } = await query(
    `INSERT INTO messages (interaction_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, interaction_id, sender_id, body, sent_at`,
    [req.params.id, req.user.sub, body]
  );
  res.status(201).json(rows[0]);
});

export default router;
