import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email.toLowerCase(), hash]
    );
    // assign default role 'client'
    await query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'client'`,
      [rows[0].id]
    );
    const token = signToken({ sub: rows[0].id, email: rows[0].email, roles: ['client'] });
    res.status(201).json({ user: rows[0], token });
  } catch (e) {
    if ((e.code || '').startsWith('23')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    throw e;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email, password required' });
  const { rows } = await query(`SELECT id, name, email, password_hash
                                FROM users WHERE email = $1`, [email.toLowerCase()]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  // roles
  const rr = await query(`SELECT r.name FROM roles r
                          JOIN user_roles ur ON ur.role_id = r.id
                          WHERE ur.user_id = $1`, [user.id]);
  const roles = rr.rows.map(r => r.name);
  const token = signToken({ sub: user.id, email: user.email, roles });
  res.json({ user: { id: user.id, name: user.name, email: user.email, roles }, token });
});

export default router;
