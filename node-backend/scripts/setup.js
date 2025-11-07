// create-schema-mysql.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from '../lib/mysql.js';  // Ton fichier mysql.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../sql/schema_mysql_ultimate.sql'), 'utf-8');
    
    // MySQL : exécute chaque requête séparément (car ; multiples)
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--') && !q.startsWith('/*'));

    for (const q of queries) {
      await connection.execute(q + ';');
    }

    console.log('[db] SCHÉMA MYSQL CRÉÉ AVEC SUCCÈS ! 🎉');
    console.log('Toutes les tables (users, roles, messages, etc.) sont prêtes !');
  } catch (err) {
    console.error('ERREUR SCHÉMA :', err);
  } finally {
    await connection.end();
  }
}

main();