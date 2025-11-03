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

-- ¡La sección de GRANT (permisos) SÍ debe quedarse! --
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO criptofrases_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO criptofrases_user;