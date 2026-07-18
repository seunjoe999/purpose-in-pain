import { Pool, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // eslint-disable-next-line no-console
  console.warn(
    '[db] DATABASE_URL is not set. Set it in backend/.env (see .env.example) before starting the server.'
  );
}

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[db] Unexpected error on idle client', err);
});

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]) {
  return pool.query<T>(text, params);
}
