// scripts/seed_mysql.js → VERSION 100% MARCHE MÊME SI BASE VIERGE
import connection from '../lib/mysql.js';

// ATTEND QUE LA BASE SOIT PRÊTE
await new Promise(resolve => setTimeout(resolve, 1500));

async function main() {
  try {
    console.log('Démarrage du seeding...');

    // 1. Rôles
    await connection.execute(`
      INSERT IGNORE INTO roles (name, description) 
      VALUES ('admin', 'Administrateur'), ('employe', 'Employé'), ('client', 'Client')
    `);

    // 2. Users
    await connection.execute(`
      INSERT INTO users (name, email, password_hash) VALUES 
      ('Alice', 'alice@example.com', '$2a$10$6V4g6Y2JtS3Z1Eo1zFuWQOSr/6kK6jv2x8nJ2u4pXk6J0H4nJ7QxO')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);

    await connection.execute(`
      INSERT INTO users (name, email, password_hash) VALUES 
      ('Bob', 'bob@example.com', '$2a$10$6V4g6Y2JtS3Z1Eo1zFuWQOSr/6kK6jv2x8nJ2u4pXk6J0H4nJ7QxO')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);

    const [[{ id: aliceId }]] = await connection.execute('SELECT id FROM users WHERE email = "alice@example.com"');
    const [[{ id: bobId }]] = await connection.execute('SELECT id FROM users WHERE email = "bob@example.com"');

    // 3. Roles
    await connection.execute(`INSERT IGNORE INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'employe'`, [aliceId]);
    await connection.execute(`INSERT IGNORE INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'client'`, [bobId]);

    // 4. Champ
    await connection.execute(`INSERT IGNORE INTO champs (label, category) VALUES ('Support', 'domaine')`);

    const [[{ id: champId }]] = await connection.execute(`SELECT id FROM champs WHERE label = 'Support'`);

    // 5. Interaction
    const [result] = await connection.execute(`
      INSERT INTO interactions (title, champ_id, created_by) 
      VALUES ('Problème de connexion', ?, ?)
    `, [champId, bobId]);

    const interactionId = result.insertId;

    // 6. Participants
    await connection.execute(`
      INSERT IGNORE INTO interaction_participants (interaction_id, user_id, role_in_interaction) VALUES 
      (?, ?, 'demandeur'), (?, ?, 'agent')
    `, [interactionId, bobId, interactionId, aliceId]);

    // 7. Message
    await connection.execute(`
      INSERT INTO messages (interaction_id, sender_id, body) 
      VALUES (?, ?, 'Bonjour, je n’arrive pas à me connecter.')
    `, [interactionId, bobId]);

    console.log('[db] SEED MYSQL COMPLET ! 🎉🎉🎉');
    console.log('Alice (employé) → alice@example.com');
    console.log('Bob (client) → bob@example.com');
    console.log('Message envoyé dans "Problème de connexion"');

  } catch (err) {
    console.error('ERREUR SEED :', err.message);
  }
}

main();