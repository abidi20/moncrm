// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { signToken } = require('../middleware/auth');

// ✅ Utilitaires centralisés (n'ajoute PAS de doublon local !)
const { sanitizeName, isValidEmail } = require('./validation');

// Hash factice pour éviter les timing attacks si l'utilisateur n'existe pas
const PLACEHOLDER_HASH = '$2a$12$3aD0H2mG32p2L3C2I6a7EebXbqgHjvC4m9h8qOIx0mC9i3Uu7s0l2';

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    name = sanitizeName(name);
    email = String(email).trim().toLowerCase();

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // L'email existe déjà ?
    const { rows: existRows } = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existRows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 12);

    // Insertion utilisateur
    const { rows: ins } = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    const userId = ins.insertId;
    if (!userId) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Ajout rôle par défaut "user" (idempotent si contrainte unique)
    await query(
      `INSERT IGNORE INTO user_roles (user_id, role_id)
       SELECT ?, id FROM roles WHERE name = 'user'`,
      [userId]
    );

    // Création du token
    const token = signToken({ sub: userId, email, roles: ['user'] });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: userId, name, email, roles: ['user'] },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  let { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  email = String(email).trim().toLowerCase();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const { rows } = await query(
      'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const user = rows[0];

    // Comparaison protégée
    const hashToCheck = user?.password_hash || PLACEHOLDER_HASH;
    const match = await bcrypt.compare(String(password), hashToCheck);
    if (!user || !match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Récupération des rôles
    const { rows: roleRows } = await query(
      `SELECT GROUP_CONCAT(r.name) AS roles
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = ?
        GROUP BY ur.user_id`,
      [user.id]
    );
    const roles = roleRows[0]?.roles ? roleRows[0].roles.split(',') : [];

    // Token + utilisateur "safe"
    const token = signToken({ sub: user.id, email: user.email, roles });
    return res.json({
      user: {
        id: user.id,
        name: sanitizeName(user.name),
        email: user.email,
        roles,
      },
      token,
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
