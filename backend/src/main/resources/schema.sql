DROP TABLE IF EXISTS words;
DROP TYPE IF EXISTS word_difficulty;

CREATE TYPE word_difficulty AS ENUM ('easy', 'normal', 'hard', 'impossible');

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    difficulty word_difficulty NOT NULL
)