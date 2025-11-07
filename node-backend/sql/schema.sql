-- PostgreSQL schema (simplified from earlier DDL), includes password_hash and small adjustments
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS citext;
EXCEPTION WHEN OTHERS THEN
  -- ignore if not available
  NULL;
END $$;

CREATE TABLE IF NOT EXISTS roles (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         CITEXT NOT NULL UNIQUE,
  password_hash TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS champs (
  id         BIGSERIAL PRIMARY KEY,
  label      TEXT NOT NULL,
  category   TEXT,
  CONSTRAINT champs_unique UNIQUE (label, COALESCE(category, ''))
);

CREATE TABLE IF NOT EXISTS interactions (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT,
  champ_id      BIGINT REFERENCES champs(id) ON DELETE SET NULL,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interaction_participants (
  interaction_id BIGINT NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_in_interaction TEXT,
  joined_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (interaction_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id             BIGSERIAL PRIMARY KEY,
  interaction_id BIGINT NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
  sender_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  body           TEXT NOT NULL,
  sent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_messages_interaction_time ON messages (interaction_id, sent_at);

CREATE TABLE IF NOT EXISTS notes (
  id             BIGSERIAL PRIMARY KEY,
  interaction_id BIGINT NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
  author_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  body           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE objectif_status AS ENUM ('ouvert', 'en_cours', 'atteint', 'abandonne');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS objectifs (
  id             BIGSERIAL PRIMARY KEY,
  interaction_id BIGINT NOT NULL REFERENCES interactions(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  status         objectif_status NOT NULL DEFAULT 'ouvert',
  due_date       DATE
);

CREATE TABLE IF NOT EXISTS produits (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  sku         TEXT,
  description TEXT,
  CONSTRAINT produits_unique UNIQUE (COALESCE(sku, ''), name)
);

CREATE TABLE IF NOT EXISTS objectif_produit (
  objectif_id BIGINT NOT NULL REFERENCES objectifs(id) ON DELETE CASCADE,
  produit_id  BIGINT NOT NULL REFERENCES produits(id) ON DELETE RESTRICT,
  PRIMARY KEY (objectif_id, produit_id)
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
