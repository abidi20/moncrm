// src/middleware/auth.js
const jwt = require('jsonwebtoken');

function signToken(payload, opts = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1d',
    ...opts,
  });
}

function decodeJWT(req, _res, next) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    const token = header.slice(7);
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_e) {
      req.user = undefined;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || !(req.user.roles || []).includes('admin')) {
    return res.status(403).json({ error: 'Admin required' });
  }
  next();
}

module.exports = { signToken, decodeJWT, requireAuth, requireAdmin };
