// src/routes/users.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/users (admin)
router.get('/', async (req, res) => {
  try {
    if (!(req.user?.roles || []).includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { rows } = await query('SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC LIMIT 200');
    res.json(rows || []);
  } catch (e) {
    console.error('List users error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
