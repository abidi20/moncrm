import pg from 'pg';
import { config } from 'dotenv';
config();

const { Pool } = pg;

const ssl =
  (process.env.PGSSL || 'false').toLowerCase() === 'true'
    ? { rejectUnauthorized: false }
    : false;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 200) {
    console.log('[db] slow query', { duration, text });
  }
  return res;
}
