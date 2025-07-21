CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS words;


DROP TABLE IF EXISTS game_sessions;
DROP TYPE IF EXISTS game_status;

CREATE TYPE game_status AS ENUM ('WON', 'LOST', 'IN_PROGRESS');

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL 
        CHECK (word ~ '^[a-z]+$') -- Error: "Word must contain only lower case letters"
        UNIQUE,
    rarity INT NOT NULL
);

CREATE TABLE game_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status game_status NOT NULL DEFAULT 'IN_PROGRESS',
    guesses TEXT[] DEFAULT '{}',
    results TEXT[] DEFAULT '{}',
    word TEXT NOT NULL,
    rarity INT NOT NULL,
    attempts INT NOT NULL DEFAULT 6,
    expires_at BIGINT DEFAULT ((extract(epoch from now() + INTERVAL '1 hour') * 1000)::BIGINT)

);

-- created_at TIMESTAMP NOT NULL DEFAULT NOW(),
