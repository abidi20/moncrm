import { Router } from 'express';
import { query } from '../db.js';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await query(`SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT 200`);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await query(`SELECT id, name, email FROM users WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.put('/:id', async (req, res) => {
  if (req.user.sub !== req.params.id && !(req.user.roles || []).includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, password } = req.body || {};
  let set = [], vals = [], i = 1;
  if (name) { set.push(`name = $${i++}`); vals.push(name); }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    set.push(`password_hash = $${i++}`); vals.push(hash);
  }
  if (!set.length) return res.json({ ok: true });
  vals.push(req.params.id);
  const { rows } = await query(`UPDATE users SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING id, name, email`, vals);
  res.json(rows[0]);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

export default router;
