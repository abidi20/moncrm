import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import interactionRoutes from './routes/interactions.js';
import messageRoutes from './routes/messages.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/users', requireAuth, userRoutes);
app.use('/interactions', requireAuth, interactionRoutes);
app.use('/interactions', requireAuth, messageRoutes); // nested routes for messages

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// error handler
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
