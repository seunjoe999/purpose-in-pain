import bcrypt from 'bcryptjs';
import { pool } from './pool';

let done = false;

export async function bootstrapAdmin() {
  if (done) return;
  done = true;

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
