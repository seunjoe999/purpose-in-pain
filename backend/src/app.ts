import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import settingsRouter from './routes/settings';
import volunteersRouter from './routes/volunteers';
import contactRouter from './routes/contact';
import newsletterRouter from './routes/newsletter';
import donationsRouter from './routes/donations';
import blogRouter from './routes/blog';
import eventsRouter from './routes/events';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'purpose-in-pain-backend', time: new Date().toISOString() });
});

app.use('/api/volunteers', volunteersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/events', eventsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);

// NOTE: the 404 + error handlers are attached separately via
// `attachFallbackHandlers()`, not here — callers (local dev server, Vercel
// serverless entry) need the chance to register their own middleware
// (e.g. static frontend serving) *before* the catch-all 404, since Express
// middleware order matters.
export function attachFallbackHandlers() {
  app.use((req, res) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
  });
}

export default app;
