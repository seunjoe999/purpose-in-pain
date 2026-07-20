import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../db/pool';
import { requireAdmin, AuthedRequest } from '../middleware/auth';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const { username, password } = parsed.data;

  const result = await pool.query(
    'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
    [username]
  );
  const admin = result.rows[0];
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET is not set.' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, secret, {
    expiresIn: '12h',
  });

  res.json({ token, username: admin.username });
});

router.get('/me', requireAdmin, (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});

// ── Dashboard data ─────────────────────────────────────────────────────────

router.get('/volunteers', requireAdmin, async (_req, res) => {
  const result = await pool.query(
    'SELECT * FROM volunteer_signups ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

router.get('/contact-messages', requireAdmin, async (_req, res) => {
  const result = await pool.query(
    'SELECT * FROM contact_messages ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

router.get('/newsletter-subscribers', requireAdmin, async (_req, res) => {
  const result = await pool.query(
    'SELECT * FROM newsletter_subscribers ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

router.get('/donations', requireAdmin, async (_req, res) => {
  const result = await pool.query(
    'SELECT * FROM donations ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

// ── Blog CRUD ────────────────────────────────────────────────────────────

const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  body: z.string().min(1),
  cover_image: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

router.post('/blog-posts', requireAdmin, async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { slug, title, excerpt, body, cover_image, author, published } = parsed.data;
  const result = await pool.query(
    `INSERT INTO blog_posts (slug, title, excerpt, body, cover_image, author, published)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true)) RETURNING *`,
    [slug, title, excerpt ?? null, body, cover_image ?? null, author ?? null, published]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/blog-posts/:id', requireAdmin, async (req, res) => {
  const parsed = blogSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const fields = parsed.data;
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: 'No fields to update.' });

  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => (fields as any)[k]);
  const result = await pool.query(
    `UPDATE blog_posts SET ${setClause}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'Post not found.' });
  res.json(result.rows[0]);
});

router.delete('/blog-posts/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

// ── Events CRUD ──────────────────────────────────────────────────────────

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  event_date: z.string().min(1),
  image: z.string().optional().nullable(),
});

router.post('/events', requireAdmin, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, description, location, event_date, image } = parsed.data;
  const result = await pool.query(
    `INSERT INTO events (title, description, location, event_date, image)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description ?? null, location ?? null, event_date, image ?? null]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/events/:id', requireAdmin, async (req, res) => {
  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const fields = parsed.data;
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: 'No fields to update.' });

  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => (fields as any)[k]);
  const result = await pool.query(
    `UPDATE events SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'Event not found.' });
  res.json(result.rows[0]);
});

router.delete('/events/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

// ── Site Settings (content portal) ────────────────────────────────────────

router.get('/settings', requireAdmin, async (_req, res) => {
  const result = await pool.query('SELECT key, value FROM site_settings ORDER BY key');
  const out: Record<string, any> = {};
  for (const row of result.rows) out[row.key] = row.value;
  res.json(out);
});

router.put('/settings/:key', requireAdmin, async (req, res) => {
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

export default router;
