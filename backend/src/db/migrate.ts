import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './pool';

dotenv.config();

async function run() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  console.log('[migrate] Applying schema.sql ...');
  await pool.query(schemaSql);
  console.log('[migrate] Schema applied.');

  const applySeed = process.env.SEED_ON_MIGRATE !== 'false';
  if (applySeed && fs.existsSync(seedPath)) {
    console.log('[migrate] Applying seed.sql (illustrative placeholder content) ...');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await pool.query(seedSql);
    console.log('[migrate] Seed applied.');
  }

  // Bootstrap the admin user from env vars if one doesn't already exist.
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminUsername && adminPassword) {
    const existing = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      [adminUsername]
    );
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [adminUsername, hash]
      );
      console.log(`[migrate] Created admin user "${adminUsername}" from ADMIN_USERNAME/ADMIN_PASSWORD env vars.`);
    } else {
      console.log(`[migrate] Admin user "${adminUsername}" already exists, skipping creation.`);
    }
  } else {
    console.log('[migrate] ADMIN_USERNAME/ADMIN_PASSWORD not set — skipping admin bootstrap. Set them in backend/.env.');
  }

  await pool.end();
  console.log('[migrate] Done.');
}

run().catch((err) => {
  console.error('[migrate] Failed:', err);
  process.exit(1);
});
