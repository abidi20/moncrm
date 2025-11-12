// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { decodeJWT } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const interactionsRoutes = require('./routes/interactions');
const messagesRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const contactsRoutes = require('./routes/contacts');
const activitiesRoutes = require('./routes/activities');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(decodeJWT);

app.get('/', (_req, res) => res.send('SICCRM backend en ligne ✅'));
app.get('/api/test', (_req, res) => res.json({ message: 'Backend fonctionne ! 🚀' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interactions', interactionsRoutes);
app.use('/api', messagesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/activities', activitiesRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));

module.exports = app;
