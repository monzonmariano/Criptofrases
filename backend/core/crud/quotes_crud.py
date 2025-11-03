# backend/core/crud/quotes_crud.py (Versión Fase 2 Corregida)

import psycopg2
from backend import db
from backend.logger_config import log



def add_quote(text: str, author: str):
    """
    Añade una nueva frase y autor. 
    La columna 'search_vector' se generará automáticamente en la BD.
    """
    conn = db.get_db_connection()
    if not conn:
        log.error("No se pudo obtener conexión a la BD para añadir quote.")
        return
    try:
        with conn.cursor() as cur:
            # La consulta ya no necesita normalized_text
            query = """
                INSERT INTO quotes (text, author) 
                VALUES (%s, %s) 
                ON CONFLICT (text) DO UPDATE SET
                    author = EXCLUDED.author;
            """
            cur.execute(query, (text, author))
            conn.commit()
    except psycopg2.Error as e:
        log.error(f"Error en quotes_crud.add_quote: {e}")
        conn.rollback()
    finally:
        if conn:
            conn.close()

# --- AQUÍ VIENE LA MODIFICACIÓN ---
async def find_author_by_keyword(phrase: str):
    """
    Busca en la BD usando un Índice de Expresión FTS.
    """
    conn = db.get_db_connection()
    if not conn:
        return None
    
    log.info(f"Búsqueda FTS (unaccent): Buscando frase: '{phrase}'")
    
    result = None
    try:
        with conn.cursor() as cur:
            # ¡NUEVA CONSULTA!
            # Buscamos contra la misma expresión que indexamos.
            # PostgreSQL verá que esto coincide con el índice GIN y lo usará.
            query = """
                SELECT text, author 
                FROM quotes 
                WHERE to_tsvector('spanish', unaccent(text)) @@ plainto_tsquery('spanish', unaccent(%s))
                LIMIT 1;
            """
            
            params = [phrase]
            
            log.info(f"Ejecutando consulta FTS: {query} con params: {params}")
            cur.execute(query, params)
            result = cur.fetchone()
            
    except psycopg2.Error as e:
        log.error(f"Error en quotes_crud.find_author_by_keyword: {e}")
    finally:
        if conn:
            conn.close()
    
    if result:
        return {"quote": result[0], "author": result[1]}
    
    log.warning("Búsqueda FTS no encontró resultados.")
    return None