import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// create interaction
router.post('/', async (req, res) => {
  const { title, champ_id } = req.body || {};
  const { rows } = await query(
    `INSERT INTO interactions (title, champ_id, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title || null, champ_id || null, req.user.sub]
  );
  const interaction = rows[0];
  // add creator as participant
  await query(
    `INSERT INTO interaction_participants (interaction_id, user_id, role_in_interaction)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [interaction.id, req.user.sub, 'initiator']
  );
  res.status(201).json(interaction);
});

// list interactions (optionally by participant)
router.get('/', async (req, res) => {
  const { participantId } = req.query;
  let rows;
  if (participantId) {
    ({ rows } = await query(`
      SELECT i.* FROM interactions i
      JOIN interaction_participants ip ON ip.interaction_id = i.id
      WHERE ip.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT 200
    `, [participantId]));
  } else {
    ({ rows } = await query(`SELECT * FROM interactions ORDER BY created_at DESC LIMIT 200`));
  }
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await query(`SELECT * FROM interactions WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/:id/participants', async (req, res) => {
  const { user_id, role_in_interaction } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  await query(
    `INSERT INTO interaction_participants (interaction_id, user_id, role_in_interaction)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [req.params.id, user_id, role_in_interaction || null]
  );
  res.status(201).json({ ok: true });
});

export default router;
