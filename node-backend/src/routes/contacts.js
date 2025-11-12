// src/routes/contacts.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { query } = require('../db');

const router = express.Router();

// Limites (sécurisées IPv6, pas de keyGenerator custom)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(readLimiter);

// helpers
const cleanStr = (s, max = 255) =>
  typeof s === 'string' ? s.trim().slice(0, max) : null;

const sanitizePayload = (body = {}) => {
  const payload = {
    first_name: cleanStr(body.first_name ?? body.firstName, 120),
    last_name:  cleanStr(body.last_name  ?? body.lastName , 120),
    email:      cleanStr(body.email, 180),
    phone:      cleanStr(body.phone, 60),
    company:    cleanStr(body.company, 180),
    address:    cleanStr(body.address, 255),
    status:     cleanStr(body.status, 32) || 'prospect',
    notes:      typeof body.notes === 'string' ? body.notes.trim().slice(0, 5000) : null,
    last_contact_at: body.last_contact_at || body.lastContactAt || null,
  };
  return payload;
};

const validate = (p, { requireEmail = false } = {}) => {
  if (requireEmail && !p.email) return 'Email is required';
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'Invalid email format';
  if (p.status && !['prospect','active','inactive'].includes(p.status)) return 'Invalid status';
  return null;
};

// GET /api/contacts?q=&page=&pageSize=
router.get('/', requireAuth, async (req, res) => {
  const q = cleanStr(req.query.q || '', 120);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);
  const offset = (page - 1) * pageSize;

  try {
    let rows, countRows;
    if (q) {
      ({ rows } = await query(
        `SELECT * FROM contacts
         WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)
         ORDER BY updated_at DESC
         LIMIT ? OFFSET ?`,
        [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, pageSize, offset]
      ));
      ({ rows: countRows } = await query(
        `SELECT COUNT(*) AS total
         FROM contacts
         WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)`,
        [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
      ));
    } else {
      ({ rows } = await query(
        `SELECT * FROM contacts
         ORDER BY updated_at DESC
         LIMIT ? OFFSET ?`,
        [pageSize, offset]
      ));
      ({ rows: countRows } = await query(
        `SELECT COUNT(*) AS total FROM contacts`
      ));
    }

    return res.json({
      page,
      pageSize,
      total: countRows[0]?.total || 0,
      items: rows || [],
    });
  } catch (e) {
    console.error('List contacts error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/:id
router.get('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const { rows } = await query(`SELECT * FROM contacts WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Contact not found' });
    return res.json(rows[0]);
  } catch (e) {
    console.error('Get contact error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contacts
router.post('/', requireAuth, writeLimiter, async (req, res) => {
  const payload = sanitizePayload(req.body);
  // email pas obligatoire, mais validé si présent
  const err = validate(payload, { requireEmail: false });
  if (err) return res.status(400).json({ error: err });

  try {
    const { rows: ins } = await query(
      `INSERT INTO contacts
       (first_name, last_name, email, phone, company, address, status, notes, last_contact_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.phone,
        payload.company,
        payload.address,
        payload.status,
        payload.notes,
        payload.last_contact_at,
      ]
    );
    const newId = ins.insertId;
    const { rows } = await query(`SELECT * FROM contacts WHERE id = ? LIMIT 1`, [newId]);
    return res.status(201).json(rows[0]);
  } catch (e) {
    if (e && e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Create contact error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/contacts/:id
router.put('/:id', requireAuth, writeLimiter, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const p = sanitizePayload(req.body);
  const err = validate(p);
  if (err) return res.status(400).json({ error: err });

  try {
    // construire SET dynamique
    const fields = [];
    const values = [];
    const add = (k, v) => { fields.push(`${k} = ?`); values.push(v); };

    if (p.first_name !== null) add('first_name', p.first_name);
    if (p.last_name  !== null) add('last_name',  p.last_name);
    if (p.email      !== null) add('email',      p.email);
    if (p.phone      !== null) add('phone',      p.phone);
    if (p.company    !== null) add('company',    p.company);
    if (p.address    !== null) add('address',    p.address);
    if (p.status     !== null) add('status',     p.status);
    if (p.notes      !== null) add('notes',      p.notes);
    if (p.last_contact_at !== null) add('last_contact_at', p.last_contact_at);

    if (fields.length === 0) return res.json({ ok: true });

    values.push(id);

    await query(`UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`, values);
    const { rows } = await query(`SELECT * FROM contacts WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Contact not found' });
    return res.json(rows[0]);
  } catch (e) {
    if (e && e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Update contact error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/contacts/:id (admin only)
router.delete('/:id', requireAuth, requireAdmin, writeLimiter, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const { rows: exist } = await query(`SELECT id FROM contacts WHERE id = ? LIMIT 1`, [id]);
    if (!exist[0]) return res.status(404).json({ error: 'Contact not found' });

    await query(`DELETE FROM contacts WHERE id = ?`, [id]);
    return res.json({ ok: true });
  } catch (e) {
    console.error('Delete contact error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// (Optionnel) GET /api/contacts/:id/interactions
// Si tu n'as pas la relation côté DB, renvoie un tableau vide proprement.
router.get('/:id/interactions', requireAuth, async (_req, res) => {
  return res.json([]); // implémente plus tard si besoin
});

module.exports = router;
