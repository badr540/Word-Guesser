CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS sessions;
DROP TYPE IF EXISTS word_difficulty;

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    rarity INT NOT NULL
);

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT,
    word TEXT NOT NULL,
    rarity INT NOT NULL,
    attempts INT NOT NULL DEFAULT 6,
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 hour')
);

-- created_at TIMESTAMP NOT NULL DEFAULT NOW(),
