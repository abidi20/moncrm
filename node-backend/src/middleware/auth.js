import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export function signToken(payload, opts = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d', ...opts });
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.roles?.includes('admin')) return next();
  return res.status(403).json({ error: 'Admin only' });
}
