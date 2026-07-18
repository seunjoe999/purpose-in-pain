import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

router.get('/', async (_req, res) => {
  const result = await pool.query(
    `SELECT * FROM events ORDER BY event_date ASC`
  );
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [req.params.id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Event not found.' });
  }
  res.json(result.rows[0]);
});

export default router;
