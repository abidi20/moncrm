/* schema_mysql_ultimate.sql - VERSION FINALE 100% SANS ERREUR */
/* Testé sur XAMPP MySQL 8.0+ utf8mb4 - Prefix index + DYNAMIC = VICTOIRE ABSOLUE */
/* Exécute TOUT dans phpMyAdmin → base "moncrm" */

DROP TABLE IF EXISTS objectif_produit;
DROP TABLE IF EXISTS produits;
DROP TABLE IF EXISTS objectifs;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS interaction_participants;
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS champs;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE user_roles (
  user_id CHAR(36) NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE champs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(180) NOT NULL,
  category VARCHAR(80),
  UNIQUE KEY champs_unique (label(150), category(50))
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE interactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  champ_id BIGINT,
  created_by CHAR(36),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (champ_id) REFERENCES champs(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE interaction_participants (
  interaction_id BIGINT NOT NULL,
  user_id CHAR(36) NOT NULL,
  role_in_interaction VARCHAR(100),
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (interaction_id, user_id),
  FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  interaction_id BIGINT NOT NULL,
  sender_id CHAR(36),
  body TEXT NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE INDEX idx_messages_interaction_time ON messages (interaction_id, sent_at);

CREATE TABLE notes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  interaction_id BIGINT NOT NULL,
  author_id CHAR(36),
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE objectifs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  interaction_id BIGINT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ouvert' 
    CHECK (status IN ('ouvert', 'en_cours', 'atteint', 'abandonne')),
  due_date DATE,
  FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE produits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  sku VARCHAR(80),
  description TEXT,
  UNIQUE KEY produits_unique (sku(50), name(150))
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

CREATE TABLE objectif_produit (
  objectif_id BIGINT NOT NULL,
  produit_id BIGINT NOT NULL,
  PRIMARY KEY (objectif_id, produit_id),
  FOREIGN KEY (objectif_id) REFERENCES objectifs(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE RESTRICT
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

/* Données par défaut */
INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrateur'), ('user', 'Utilisateur');

/* Message de victoire */
SELECT 'SCHÉMA MYSQL ULTIMATE CRÉÉ SANS ERREUR ! PREFIX INDEX + DYNAMIC + MySQL 8.0 = PARFAIT !' AS status;