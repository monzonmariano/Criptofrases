#------------------------------ Archivo: "update.py" -------------------------------
#---------------------------- Actualiza datos en la tabla ----------------------------

import psycopg2
import logging
from backend import db

def update_entry(entry_id, data):
    """
    Actualiza una entrada existente en la tabla 'entries'.

    Args:
        entry_id (int): El ID de la entrada a actualizar.
        data (dict): Un diccionario con los datos a actualizar.

    Returns:
        bool: True si la actualización fue exitosa, False en caso contrario.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return False
        with conn.cursor() as cur:
            # Construir la consulta de forma dinámica para manejar campos opcionales
            updates = []
            values = []
            if 'content' in data:
                updates.append("content = %s")
                values.append(data['content'])
            if 'result' in data:
                updates.append("result = %s")
                values.append(data['result'])
            if 'author' in data:
                updates.append("author = %s")
                values.append(data['author'])
            if 'is_cryptogram' in data:
                updates.append("is_cryptogram = %s")
                values.append(data['is_cryptogram'])

            if not updates:
                logging.warning("No hay campos para actualizar.")
                conn.close()
                return False

            values.append(entry_id)
            query = f"UPDATE entries SET {', '.join(updates)} WHERE id = %s;"

            cur.execute(query, tuple(values))
            conn.commit()
        conn.close()
        return cur.rowcount > 0
    except psycopg2.Error as e:
        logging.error(f"Error al actualizar la entrada: {e}")
        return False