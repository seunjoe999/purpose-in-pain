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

router.get('/:slug/comments', async (req, res) => {
  const post = await pool.query(
    `SELECT id FROM blog_posts WHERE slug = $1 AND published = true`,
    [req.params.slug]
  );
  if (post.rowCount === 0) return res.status(404).json({ error: 'Post not found.' });
  const comments = await pool.query(
    `SELECT id, author_name, body, created_at FROM blog_comments WHERE post_id = $1 ORDER BY created_at ASC`,
    [post.rows[0].id]
  );
  res.json(comments.rows);
});

router.post('/:slug/comments', async (req, res) => {
  const { author_name, body } = req.body as { author_name?: string; body?: string };
  if (!author_name?.trim() || !body?.trim()) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }
  const post = await pool.query(
    `SELECT id FROM blog_posts WHERE slug = $1 AND published = true`,
    [req.params.slug]
  );
  if (post.rowCount === 0) return res.status(404).json({ error: 'Post not found.' });
  const result = await pool.query(
    `INSERT INTO blog_comments (post_id, author_name, body) VALUES ($1, $2, $3) RETURNING id, author_name, body, created_at`,
    [post.rows[0].id, author_name.trim(), body.trim()]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
