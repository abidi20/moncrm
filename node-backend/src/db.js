// src/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const useSsl = String(process.env.MYSQL_SSL || process.env.PGSSL || 'false').toLowerCase() === 'true';
const ssl = useSsl ? { rejectUnauthorized: false } : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.PGHOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || process.env.PGPORT || 3306),
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.PGDATABASE || 'moncrm',
  user: process.env.DB_USER || process.env.MYSQLUSER || process.env.PGUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.PGPASSWORD || '',
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60_000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function query(sql, params = []) {
  const start = Date.now();
  const [rows, fields] = await pool.execute(sql, params);
  const duration = Date.now() - start;
  if (duration > 200) console.log('[db] slow query', { duration, sql, params });
  return { rows, fields };
}

process.on('SIGTERM', async () => {
  console.log('[db] Closing MySQL pool...');
  await pool.end();
  process.exit(0);
});

module.exports = { pool, query };
