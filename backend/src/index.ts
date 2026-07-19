import path from 'path';
import fs from 'fs';
import express from 'express';
import app, { attachFallbackHandlers } from './app';

const PORT = process.env.PORT || 4000;

// ── Serve the built React frontend (single-service monolith deploy, e.g.
// Render) — only kicks in when frontend/dist exists next to this repo.
// Not used on Vercel, where the frontend is deployed as its own project
// and this backend runs as a serverless function via backend/api/index.ts.
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

attachFallbackHandlers();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Purpose In Pain backend listening on http://localhost:${PORT}`);
});
