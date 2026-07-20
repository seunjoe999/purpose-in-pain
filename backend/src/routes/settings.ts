import { Router } from 'express';
import { pool } from '../db/pool';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Auto-create table on first use
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key   VARCHAR(100) PRIMARY KEY,
      value JSONB        NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

ensureTable().catch(console.error);

// Public: read all settings
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_settings');
    const out: Record<string, any> = {};
    for (const row of result.rows) out[row.key] = row.value;
    res.json(out);
  } catch {
    res.json({});
  }
});

// Admin: upsert a setting
router.put('/:key', requireAdmin, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'value is required' });
  await pool.query(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
  res.json({ key, value });
});

// Admin: delete a setting
router.delete('/:key', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM site_settings WHERE key = $1', [req.params.key]);
  res.status(204).send();
});

export default router;
