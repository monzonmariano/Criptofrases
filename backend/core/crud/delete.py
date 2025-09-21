# backend/core/crud/delete.py (Versión Final Pulida)

import psycopg2 # <-- Lo conservamos para capturar errores específicos
from backend import db
from backend.logger_config import log

def delete_entry(entry_id, user_id):
    """
    Elimina UNA entrada específica de la tabla 'entries' por su ID,
    verificando la propiedad del usuario.
    """
    conn = db.get_db_connection()
    if not conn:
        return False
    
    try:
        with conn.cursor() as cur:
            sql = "DELETE FROM entries WHERE id = %s AND user_id = %s;"
            cur.execute(sql, (entry_id, user_id))
            conn.commit()
            return cur.rowcount > 0
    except psycopg2.Error as e: # <-- Usamos el error específico
        log.exception(f"Error de base de datos en CRUD al eliminar la entrada: {e}")
        conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

def delete_all_user_entries(user_id):
    """
    Elimina TODAS las entradas de un usuario específico.
    """
    conn = db.get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            sql = "DELETE FROM entries WHERE user_id = %s;"
            cur.execute(sql, (user_id,))
            conn.commit()
            deleted_rows = cur.rowcount
            log.info(f"Se eliminaron {deleted_rows} entradas para el usuario {user_id}.")
            return deleted_rows
    except psycopg2.Error as e: # <-- Usamos el error específico
        log.exception(f"Error de base de datos en CRUD al limpiar historial: {e}")
        conn.rollback()
        return None
    finally:
        if conn:
            conn.close()