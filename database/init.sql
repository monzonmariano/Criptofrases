-- Archivo: database/init.sql (Versión 2.0)
-- Eliminamos la tabla anterior si existe para aplicar los cambios limpios.
DROP TABLE IF EXISTS entries;

CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    -- 'content', 'result', y 'author' ahora pueden ser NULL
    content TEXT,
    result TEXT,
    author TEXT,
    -- 'entry_type' es más claro que 'is_cryptogram' para el futuro
    entry_type VARCHAR(50) NOT NULL, -- Ej: 'solver', 'ai_generator', 'user_generator'
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);