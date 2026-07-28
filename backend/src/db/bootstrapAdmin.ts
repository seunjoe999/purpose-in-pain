import bcrypt from 'bcryptjs';
import { pool } from './pool';

let done = false;

export async function bootstrapAdmin() {
  if (done) return;
  done = true;

  // Ensure tables added after initial deploy exist (idempotent).
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id       UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        author_name   TEXT NOT NULL,
        body          TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments (post_id, created_at ASC);
    `);
  } catch (err) {
    console.error('[bootstrap] Schema migration error:', err);
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hash]
    );
    console.log(`[bootstrap] Admin user "${username}" ready.`);
  } catch (err) {
    console.error('[bootstrap] Admin bootstrap error:', err);
  }
}
