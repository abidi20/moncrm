import { query, pool } from '../src/db.js';

async function main() {
  // roles
  await query(`INSERT INTO roles (name) VALUES ('admin') ON CONFLICT DO NOTHING`);
  await query(`INSERT INTO roles (name) VALUES ('employe') ON CONFLICT DO NOTHING`);
  await query(`INSERT INTO roles (name) VALUES ('client') ON CONFLICT DO NOTHING`);

  // demo users
  const { rows: u1 } = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ('Alice', 'alice@example.com', '$2a$10$6V4g6Y2JtS3Z1Eo1zFuWQOSr/6kK6jv2x8nJ2u4pXk6J0H4nJ7QxO') 
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`
  );
  const { rows: u2 } = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ('Bob', 'bob@example.com', '$2a$10$6V4g6Y2JtS3Z1Eo1zFuWQOSr/6kK6jv2x8nJ2u4pXk6J0H4nJ7QxO')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`
  );

  // assign roles
  await query(`INSERT INTO user_roles (user_id, role_id)
               SELECT $1, (SELECT id FROM roles WHERE name='employe')
               ON CONFLICT DO NOTHING`, [u1[0].id]);
  await query(`INSERT INTO user_roles (user_id, role_id)
               SELECT $1, (SELECT id FROM roles WHERE name='client')
               ON CONFLICT DO NOTHING`, [u2[0].id]);

  // champs
  await query(`INSERT INTO champs (label, category) VALUES ('Support', 'domaine')
               ON CONFLICT DO NOTHING`);

  // interaction + participants + message
  const { rows: inter } = await query(`
    INSERT INTO interactions (title, champ_id, created_by)
    VALUES ('Problème de connexion', (SELECT id FROM champs WHERE label='Support'), $1)
    RETURNING id
  `, [u2[0].id]);
  await query(`INSERT INTO interaction_participants (interaction_id, user_id, role_in_interaction)
               VALUES ($1, $2, 'demandeur'), ($1, $3, 'agent')
               ON CONFLICT DO NOTHING`, [inter[0].id, u2[0].id, u1[0].id]);
  await query(`INSERT INTO messages (interaction_id, sender_id, body)
               VALUES ($1, $2, 'Bonjour, je n’arrive pas à me connecter.')
  `, [inter[0].id, u2[0].id]);

  await pool.end();
  console.log('[db] seed complete');
}
main().catch(err => { console.error(err); process.exit(1); });
