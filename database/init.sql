-- database/init.sql
-- (Versión limpia sin creación de usuario redundante)

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    key_phrase VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS quotes_search_idx 
ON quotes 
USING GIN (to_tsvector('spanish', unaccent(text)));

-- --- ¡NUEVA TABLA! ---
-- Guarda solo UN juego en progreso por usuario (usando user_id como Clave Primaria)
CREATE TABLE IF NOT EXISTS active_sudoku_games (
    user_id VARCHAR(255) PRIMARY KEY,
    board JSONB NOT NULL,
    original_board JSONB NOT NULL,
    solution JSONB NOT NULL,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- --- FIN DE LA NUEVA TABLA ---

-- --- Tabla para Criptogramas Activos ---
-- Guarda solo UN criptograma en progreso por usuario
CREATE TABLE IF NOT EXISTS active_cryptogram_games (
    user_id VARCHAR(255) PRIMARY KEY,
    theme VARCHAR(100),
    cryptogram TEXT NOT NULL,
    original_phrase TEXT NOT NULL,
    clues JSONB,
    solution_key JSONB NOT NULL,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dar permisos a nuestro usuario
GRANT ALL PRIVILEGES ON TABLE active_cryptogram_games TO criptofrases_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO criptofrases_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO criptofrases_user;