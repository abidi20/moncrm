// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { signToken } = require('../middleware/auth');

const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const sanitizeName = (name) => (typeof name === 'string' ? name.trim().replace(/<[^>]*>/g, '') : '').slice(0, 50);
const PLACEHOLDER_HASH = '$2a$12$3aD0H2mG32p2L3C2I6a7EebXbqgHjvC4m9h8qOIx0mC9i3Uu7s0l2';

router.post('/register', async (req, res) => {
  let { name, email, password } = req.body ?? {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

  name = sanitizeName(name);
  email = String(email).trim().toLowerCase();
  if (name.length < 2) return res.status(400).json({ error: 'Name must be 2–50 characters' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: 'Password must be ≥ 8 characters' });

  try {
    const { rows: exist } = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (exist.length) return res.status(409).json({ error: 'Email already exists' });

    const hash = await bcrypt.hash(password, 12);
    const { rows: ins } = await query(
      `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
      [name, email, hash]
    );
    const userId = ins?.insertId;
    if (!userId) return res.status(500).json({ error: 'Failed to create user' });

    await query(
      `INSERT IGNORE INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'client'`,
      [userId]
    );

    const token = signToken({ sub: userId, email, roles: ['client'] });
    res.status(201).json({ user: { id: userId, name, email }, token });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  email = String(email).trim().toLowerCase();
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

  try {
    const { rows } = await query(
      `SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    const user = rows[0];

    const hashToCheck = user?.password_hash || PLACEHOLDER_HASH;
    const match = await bcrypt.compare(String(password), hashToCheck);
    if (!user || !match) return res.status(401).json({ error: 'Invalid credentials' });

    const { rows: roleRows } = await query(
      `SELECT GROUP_CONCAT(r.name) AS roles
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = ?
        GROUP BY ur.user_id`,
      [user.id]
    );
    const roles = roleRows[0]?.roles ? roleRows[0].roles.split(',') : [];

    const token = signToken({ sub: user.id, email: user.email, roles });
    res.json({ user: { id: user.id, name: sanitizeName(user.name), email: user.email, roles }, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
