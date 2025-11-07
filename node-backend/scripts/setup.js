import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf-8');
  await query(sql);
  await pool.end();
  console.log('[db] schema created');
}
main().catch(err => { console.error(err); process.exit(1); });
