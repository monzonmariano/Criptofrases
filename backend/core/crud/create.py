#-------------------------------- Archivo: "create.py" -------------------------------
#-------------------------- Inserta datos en la tabla ----------------------------------

import psycopg2
import logging
from backend import db

def create_entry(data):
    """
    Inserta una nueva entrada en la tabla 'entries'.

    Args:
        data (dict): Un diccionario con los datos de la entrada, incluyendo
                     'content', 'result', 'author', 'is_cryptogram' y 'user_id'.

    Returns:
        int: El ID de la nueva entrada creada.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return None
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO entries (content, result, author, is_cryptogram, user_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (data['content'], data['result'], data['author'], data['is_cryptogram'], data['user_id'])
            )
            entry_id = cur.fetchone()[0]
            conn.commit()
        conn.close()
        return entry_id
    except psycopg2.Error as e:
        logging.error(f"Error al crear la entrada: {e}")
        return None