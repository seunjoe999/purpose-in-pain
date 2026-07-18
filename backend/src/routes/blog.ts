import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

router.get('/', async (_req, res) => {
  const result = await pool.query(
    `SELECT id, slug, title, excerpt, cover_image, author, created_at
     FROM blog_posts WHERE published = true ORDER BY created_at DESC`
  );
  res.json(result.rows);
});

router.get('/:slug', async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM blog_posts WHERE slug = $1 AND published = true`,
    [req.params.slug]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json(result.rows[0]);
});

export default router;
