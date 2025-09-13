#----------------------------- Archivo : "delete.py" ------------------------------
#---------------------------- Borra datos en la tabla ------------------------------

import psycopg2
import logging
from backend import db

def delete_entry(entry_id):
    """
    Elimina una entrada de la tabla 'entries' por su ID.

    Args:
        entry_id (int): El ID de la entrada a eliminar.

    Returns:
        bool: True si la eliminación fue exitosa, False en caso contrario.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return False
        with conn.cursor() as cur:
            cur.execute("DELETE FROM entries WHERE id = %s;", (entry_id,))
            conn.commit()
        conn.close()
        return cur.rowcount > 0
    except psycopg2.Error as e:
        logging.error(f"Error al eliminar la entrada: {e}")
        return False