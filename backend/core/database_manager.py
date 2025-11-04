# backend/core/database_manager.py
# (Versión completa con Sudoku + Criptogramas Activos)

import os
import json
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from backend.logger_config import log

# --- 1. CONFIGURACIÓN DE LA CONEXIÓN ---
# Asume que .env está en la RAÍZ del proyecto
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env')) 

try:
    db_pool = psycopg2.pool.SimpleConnectionPool(
        1,  # minconn
        10, # maxconn
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT'),
        database=os.environ.get('DB_NAME'),
        sslmode='require' # ¡Importante para Neon!
    )
    log.info("✅ Pool de conexiones a la BD creado exitosamente.")

except (Exception, psycopg2.Error) as error:
    log.error(f"❌ Error fatal al crear el pool de conexiones: {error}")
    db_pool = None

# --- 2. FUNCIÓN DE AYUDA (HELPER) ---

def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=True):
    if not db_pool:
        log.error("El pool de la BD no está inicializado. La consulta no puede ejecutarse.")
        return None
    conn = None
    cur = None
    try:
        conn = db_pool.getconn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(query, params)
        result = None
        if fetch_one:
            result = cur.fetchone()
        elif fetch_all:
            result = cur.fetchall()
        if commit:
            conn.commit()
        return result
    except (Exception, psycopg2.Error) as error:
        log.error(f"Error en execute_query: {error}")
        log.error(f"Query problemática (con params): {query}, {params}")
        if conn:
            conn.rollback() 
        return None
    finally:
        if cur:
            cur.close()
        if conn:
            db_pool.putconn(conn)

# --- 3. FUNCIONES DE LÓGICA DE NEGOCIO (CRIPTOGRAMAS/HISTORIAL) ---

def create_new_entry(data):
    """
    Crea una nueva entrada en la tabla 'entries'.
    (Arreglado para incluir entry_type en la query)
    """
    user_id = data.get('user_id', 'unknown')
    entry_type = data.get('entry_type', 'generic')
    details_json = data.get('details', '{}') # 'details' debe ser un string JSON

    # --- ¡QUERY CORREGIDA! Incluye entry_type ---
    sql = """
    INSERT INTO entries (key_phrase, wallet_address, details, created_at, entry_type)
    VALUES (%s, %s, %s, CURRENT_TIMESTAMP, %s)
    """
    
    import uuid
    key_phrase = str(uuid.uuid4())
    
    try:
        # Los parámetros DEBEN coincidir con el orden de las columnas: key_phrase, wallet_address, details, entry_type
        execute_query(sql, (key_phrase, user_id, details_json, entry_type))
        log.info(f"Entrada de historial '{entry_type}' guardada para {user_id}")
        return True # ¡Devuelve True solo si la consulta fue exitosa!

    except Exception as e:
        log.error(f"Error en create_new_entry para {user_id}: {e}")
        return False

def delete_existing_entry(entry_id, user_id):
    """
    Borra una entrada específica del historial, verificando el propietario.
    (Asume que 'wallet_address' es el user_id)
    """
    sql = "DELETE FROM entries WHERE id = %s AND wallet_address = %s"
    try:
        execute_query(sql, (entry_id, user_id))
        log.info(f"Entrada {entry_id} borrada por el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al borrar la entrada {entry_id}: {e}")
        return False

def clear_all_entries(user_id):
    """
    Borra TODAS las entradas del historial de un usuario.
    (Asume que 'wallet_address' es el user_id)
    """
    sql = "DELETE FROM entries WHERE wallet_address = %s"
    try:
        execute_query(sql, (user_id,))
        log.info(f"Historial completo borrado para el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al borrar el historial de {user_id}: {e}")
        return False

# --- 4. FUNCIONES DE SUDOKU (EXISTENTES) ---

def save_sudoku_game(user_id, board, original_board, solution):
    sql = """
    INSERT INTO active_sudoku_games (user_id, board, original_board, solution, last_played)
    VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
        board = EXCLUDED.board,
        original_board = EXCLUDED.original_board,
        solution = EXCLUDED.solution,
        last_played = CURRENT_TIMESTAMP;
    """
    try:
        board_json = json.dumps(board)
        original_board_json = json.dumps(original_board)
        solution_json = json.dumps(solution)
        execute_query(sql, (user_id, board_json, original_board_json, solution_json))
        log.info(f"Partida de Sudoku guardada para el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al guardar Sudoku para {user_id}: {e}")
        return False

def get_active_sudoku(user_id):
    sql = "SELECT board, original_board, solution, last_played FROM active_sudoku_games WHERE user_id = %s"
    try:
        result = execute_query(sql, (user_id,), fetch_one=True)
        if result:
            log.info(f"Cargado Sudoku activo para el usuario {user_id}")
            return result 
        return None
    except Exception as e:
        log.error(f"Error al cargar Sudoku para {user_id}: {e}")
        return None

def delete_active_sudoku(user_id):
    sql = "DELETE FROM active_sudoku_games WHERE user_id = %s"
    try:
        execute_query(sql, (user_id,))
        log.info(f"Borrado Sudoku activo para el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al borrar Sudoku para {user_id}: {e}")
        return False

# --- 5. ¡NUEVAS FUNCIONES DE CRIPTOGRAMA ACTIVO! ---

def save_active_cryptogram(user_id, theme, cryptogram, original_phrase, clues, solution_key):
    """
    Guarda (o actualiza) el criptograma activo de un usuario.
    Usa "UPSERT" (INSERT ... ON CONFLICT ... DO UPDATE).
    """
    sql = """
    INSERT INTO active_cryptogram_games 
        (user_id, theme, cryptogram, original_phrase, clues, solution_key, last_played)
    VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
        theme = EXCLUDED.theme,
        cryptogram = EXCLUDED.cryptogram,
        original_phrase = EXCLUDED.original_phrase,
        clues = EXCLUDED.clues,
        solution_key = EXCLUDED.solution_key,
        last_played = CURRENT_TIMESTAMP;
    """
    try:
        clues_json = json.dumps(clues)
        solution_key_json = json.dumps(solution_key)
        
        execute_query(sql, (user_id, theme, cryptogram, original_phrase, clues_json, solution_key_json))
        log.info(f"Criptograma activo guardado para el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al guardar Criptograma para {user_id}: {e}")
        return False

def get_active_cryptogram(user_id):
    """
Ofrece el criptograma activo (si existe) para un usuario.
    """
    sql = "SELECT theme, cryptogram, original_phrase, clues, solution_key, last_played FROM active_cryptogram_games WHERE user_id = %s"
    try:
        result = execute_query(sql, (user_id,), fetch_one=True)
        if result:
            log.info(f"Cargado Criptograma activo para el usuario {user_id}")
            return result
        return None
    except Exception as e:
        log.error(f"Error al cargar Criptograma para {user_id}: {e}")
        return None

def delete_active_cryptogram(user_id):
    """
    Borra el criptograma activo de un usuario (cuando lo resuelve).
    """
    sql = "DELETE FROM active_cryptogram_games WHERE user_id = %s"
    try:
        execute_query(sql, (user_id,))
        log.info(f"Borrado Criptograma activo para el usuario {user_id}")
        return True
    except Exception as e:
        log.error(f"Error al borrar Criptograma para {user_id}: {e}")
        return False

# --- 6. FUNCIÓN DE HISTORIAL (MODIFICADA OTRA VEZ) ---

def get_user_history(user_id):
    """
    Obtiene historial de entradas completadas, sudoku activo Y criptograma activo.
    """
    if not user_id:
        return None
        
    # 1. Obtener entradas completadas (Asumiendo que 'wallet_address' guarda el user_id)
    #    ¡He añadido 'details' para tu modal!
    sql_entries = "SELECT id, key_phrase, details, created_at AS timestamp FROM entries WHERE wallet_address = %s ORDER BY timestamp DESC"
    
    # 2. Obtener Sudoku activo
    active_sudoku = get_active_sudoku(user_id)
    
    # 3. Obtener Criptograma activo
    active_cryptogram = get_active_cryptogram(user_id)

    try:
        completed_entries = execute_query(sql_entries, (user_id,), fetch_all=True)
        
        # 4. Devolver todo
        return {
            "completed_entries": completed_entries or [],
            "active_sudoku": active_sudoku,      # Esto será el juego o None
            "active_cryptogram": active_cryptogram # Esto será el juego o None
        }
    except Exception as e:
        log.error(f"Error al obtener historial combinado para {user_id}: {e}")
        return None