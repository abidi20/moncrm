// src/routes/interactions.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

// Limiteur pour éviter le spam de création / modification
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many interaction actions, try again later.' },
});

// --------- Helpers / validation ---------

const cleanStr = (s, max = 255) =>
  typeof s === 'string' ? s.trim().slice(0, max) : null;

const sanitizeText = (s, max = 5000) =>
  typeof s === 'string'
    ? s.trim().replace(/<[^>]*>/g, '').slice(0, max)
    : null;

const parseIntOrNull = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

const parseDateTimeOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 19).replace('T', ' ');
};

const allowedTypes = ['call', 'email', 'meeting', 'note'];
const allowedPriorities = ['low', 'medium', 'high'];
const allowedStatus = ['scheduled', 'completed', 'cancelled', 'sent'];

const validateInteraction = (p) => {
  if (!p.title) return 'Title is required';
  if (!p.type || !allowedTypes.includes(p.type)) return 'Invalid type';
  if (!p.contact_id) return 'Contact is required';
  if (p.priority && !allowedPriorities.includes(p.priority)) return 'Invalid priority';
  if (p.status && !allowedStatus.includes(p.status)) return 'Invalid status';

  if (p.duration_min !== null && p.duration_min !== undefined) {
    if (Number.isNaN(p.duration_min) || p.duration_min < 0) {
      return 'duration_min must be a positive number';
    }
  }

  return null;
};

// --------- CREATE  (POST /api/interactions) ---------

router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const body = req.body ?? {};

  const payload = {
    title: cleanStr(body.title, 200),
    type: cleanStr(body.type, 20) || 'call',
    description: sanitizeText(body.description),
    contact_id: parseIntOrNull(body.contact_id),
    scheduled_at: parseDateTimeOrNull(body.scheduled_at),
    duration_min: parseIntOrNull(body.duration_min),
    priority: cleanStr(body.priority, 20) || 'medium',
    status: cleanStr(body.status, 20) || 'scheduled',
    notes: sanitizeText(body.notes),
    champ_id: parseIntOrNull(body.champ_id),
  };

  const err = validateInteraction(payload);
  if (err) return res.status(400).json({ error: err });

  try {
    const { rows: ins } = await query(
      `INSERT INTO interactions
       (title, type, description, contact_id, scheduled_at, duration_min,
        priority, status, notes, champ_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.title,
        payload.type,
        payload.description,
        payload.contact_id,
        payload.scheduled_at,
        payload.duration_min,
        payload.priority,
        payload.status,
        payload.notes,
        payload.champ_id,
        userId,
      ]
    );

    const newId = ins.insertId;
    if (!newId) return res.status(500).json({ error: 'Failed to create interaction' });

    const { rows } = await query(
      `SELECT i.*, c.first_name, c.last_name, c.company
         FROM interactions i
         LEFT JOIN contacts c ON c.id = i.contact_id
        WHERE i.id = ? LIMIT 1`,
      [newId]
    );

    return res.status(201).json(rows[0]);
  } catch (e) {
    console.error('Create interaction error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --------- LIST  (GET /api/interactions) ---------

router.get('/', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;

    let where = '';
    const params = [];

    if (q) {
      where = `
        WHERE (i.title LIKE ?
           OR c.first_name LIKE ?
           OR c.last_name LIKE ?
           OR c.company LIKE ?)
      `;
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    // ⚠ LIMIT / OFFSET sans "?" pour éviter ER_WRONG_ARGUMENTS
    const listSql = `
      SELECT
        i.*,
        c.first_name,
        c.last_name,
        c.company
      FROM interactions i
      LEFT JOIN contacts c ON c.id = i.contact_id
      ${where}
      ORDER BY (i.scheduled_at IS NULL), i.scheduled_at DESC, i.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM interactions i
      LEFT JOIN contacts c ON c.id = i.contact_id
      ${where}
    `;

    const { rows: items } = await query(listSql, params);
    const { rows: countRows } = await query(countSql, params);

    return res.json({
      page,
      pageSize,
      total: countRows[0]?.total || 0,
      items: items || [],
    });
  } catch (e) {
    console.error('List interactions error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --------- DETAIL  (GET /api/interactions/:id) ---------

router.get('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const { rows } = await query(
      `SELECT
         i.*,
         c.first_name,
         c.last_name,
         c.company
       FROM interactions i
       LEFT JOIN contacts c ON c.id = i.contact_id
       WHERE i.id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (e) {
    console.error('Get interaction error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --------- UPDATE  (PUT /api/interactions/:id) ---------

router.put('/:id', requireAuth, writeLimiter, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const body = req.body ?? {};

  const payload = {
    title: cleanStr(body.title, 200),
    type: cleanStr(body.type, 20) || 'call',
    description: sanitizeText(body.description),
    contact_id: parseIntOrNull(body.contact_id),
    scheduled_at: parseDateTimeOrNull(body.scheduled_at),
    duration_min: parseIntOrNull(body.duration_min),
    priority: cleanStr(body.priority, 20) || 'medium',
    status: cleanStr(body.status, 20) || 'scheduled',
    notes: sanitizeText(body.notes),
    champ_id: parseIntOrNull(body.champ_id),
  };

  const err = validateInteraction(payload);
  if (err) return res.status(400).json({ error: err });

  try {
    const { rows: exist } = await query(
      `SELECT id FROM interactions WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!exist[0]) return res.status(404).json({ error: 'Interaction not found' });

    await query(
      `UPDATE interactions SET
         title = ?,
         type = ?,
         description = ?,
         contact_id = ?,
         scheduled_at = ?,
         duration_min = ?,
         priority = ?,
         status = ?,
         notes = ?,
         champ_id = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.type,
        payload.description,
        payload.contact_id,
        payload.scheduled_at,
        payload.duration_min,
        payload.priority,
        payload.status,
        payload.notes,
        payload.champ_id,
        id,
      ]
    );

    const { rows } = await query(
      `SELECT
         i.*,
         c.first_name,
         c.last_name,
         c.company
       FROM interactions i
       LEFT JOIN contacts c ON c.id = i.contact_id
       WHERE i.id = ? LIMIT 1`,
      [id]
    );

    return res.json(rows[0]);
  } catch (e) {
    console.error('Update interaction error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --------- PARTICIPANTS (facultatif)  ---------

router.post('/:id/participants', requireAuth, writeLimiter, async (req, res) => {
  const interactionId = parseInt(req.params.id, 10);
  if (Number.isNaN(interactionId)) return res.status(400).json({ error: 'Invalid interaction ID' });

  let { user_id, role_in_interaction } = req.body ?? {};
  const uid = parseIntOrNull(user_id);
  if (!uid) return res.status(400).json({ error: 'user_id required' });

  try {
    const { rows: exist } = await query(
      `SELECT id FROM interactions WHERE id = ? LIMIT 1`,
      [interactionId]
    );
    if (!exist[0]) return res.status(404).json({ error: 'Interaction not found' });

    await query(
      `INSERT IGNORE INTO interaction_participants
         (interaction_id, user_id, role_in_interaction)
       VALUES (?, ?, ?)`,
      [interactionId, uid, cleanStr(role_in_interaction, 100)]
    );

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('Add participant error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// --------- DELETE  (DELETE /api/interactions/:id) ---------

router.delete('/:id', requireAuth, writeLimiter, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    // Vérifier que l'interaction existe
    const { rows: exist } = await query(
      'SELECT id, created_by FROM interactions WHERE id = ? LIMIT 1',
      [id]
    );
    if (!exist[0]) {
      return res.status(404).json({ error: 'Not found' });
    }

    // (Optionnel) sécurité : seul le créateur peut supprimer
    if (exist[0].created_by && exist[0].created_by !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Supprimer les participants liés (si tu utilises cette table)
    await query(
      'DELETE FROM interaction_participants WHERE interaction_id = ?',
      [id]
    );

    // Supprimer l’interaction
    await query('DELETE FROM interactions WHERE id = ?', [id]);

    return res.json({ ok: true });
  } catch (e) {
    console.error('Delete interaction error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// GET /api/contacts/:id/interactions
// Renvoie les interactions liées à CE contact
router.get('/:id/interactions', requireAuth, async (req, res) => {
  const contactId = parseInt(req.params.id, 10);
  if (Number.isNaN(contactId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // on peut passer ?limit=5 dans l’URL, sinon 5 par défaut
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);

  try {
    const { rows } = await query(
      `SELECT
         id,
         title,
         type,
         description,
         scheduled_at,
         duration_min,
         status,
         priority,
         notes
       FROM interactions
       WHERE contact_id = ?
       ORDER BY COALESCE(scheduled_at, created_at) DESC
       LIMIT ?`,
      [contactId, limit]
    );

    return res.json(rows || []);
  } catch (e) {
    console.error('Contact interactions error:', e);
    return res
      .status(500)
      .json({ error: 'Internal server error' });
  }
});

module.exports = router;
