// lib/mysql.js → VERSION QUI MARCHE DIRECT SANS RIEN ATTENDRE
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moncrm',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// CRÉE LA BASE AU PREMIER APPEL SI ELLE EXISTE PAS
connection.getConnection()
  .then(conn => {
    conn.query('CREATE DATABASE IF NOT EXISTS moncrm')
      .then(() => conn.query('USE moncrm'))
      .then(() => {
        console.log('✅ Base moncrm prête (créée si besoin) !');
        conn.release();
      })
      .catch(() => conn.release());
  })
  .catch(() => {});

export default connection;