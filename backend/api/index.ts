// Vercel serverless entry point. Vercel's Node runtime treats a default-exported
// Express app as a request handler directly (req, res) — no separate adapter
// needed. The frontend is a separate Vercel project; this function only
// serves /api/* (see backend/vercel.json).
import app, { attachFallbackHandlers } from '../src/app';

attachFallbackHandlers();

export default app;
