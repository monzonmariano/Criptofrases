#----------------------------- Archivo : "read.py" ------------------------------
#---------------------------- Lee datos en la tabla ------------------------------

import psycopg2
import logging
from backend import db

def get_entry_by_id(entry_id):
    """
    Recupera una entrada de la tabla 'entries' por su ID.

    Args:
        entry_id (int): El ID de la entrada a buscar.

    Returns:
        dict: Un diccionario con los datos de la entrada o None si no se encuentra.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return None
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, content, result, author, is_cryptogram, timestamp, user_id FROM entries WHERE id = %s;",
                (entry_id,)
            )
            entry = cur.fetchone()
        conn.close()
        if entry:
            return {
                'id': entry[0],
                'content': entry[1],
                'result': entry[2],
                'author': entry[3],
                'is_cryptogram': entry[4],
                'timestamp': entry[5],
                'user_id': entry[6]
            }
        return None
    except psycopg2.Error as e:
        logging.error(f"Error al obtener la entrada por ID: {e}")
        return None

def get_entries_by_user(user_id):
    """
    Recupera todas las entradas de un usuario específico.

    Args:
        user_id (str): El ID del usuario.

    Returns:
        list: Una lista de diccionarios, cada uno representando una entrada.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return []
        with conn.cursor() as cur:
            # 1. Nos aseguramos de pedir la columna 'timestamp'.
            # 2. Ordenamos por 'timestamp DESC' para que las entradas más nuevas aparezcan primero.
            query = """
                SELECT id, content, result, author, is_cryptogram, timestamp, user_id 
                FROM entries 
                WHERE user_id = %s 
                ORDER BY timestamp DESC;
            """
            cur.execute(query, (user_id,))
            entries = cur.fetchall()
        conn.close()
        return [{
            'id': entry[0],
            'content': entry[1],
            'result': entry[2],
            'author': entry[3],
            'is_cryptogram': entry[4],
            # 1. Verificamos si la fecha (entry[5]) existe.
            # 2. Si existe, la convertimos a un string en formato ISO 8601.
            'created_at': entry[5].isoformat() if entry[5] else None,
            'user_id': entry[6]
        } for entry in entries]
    except psycopg2.Error as e:
        logging.error(f"Error al obtener las entradas del usuario: {e}")
        return []

def get_all_entries():
    """
    Recupera todas las entradas de la base de datos.

    Returns:
        list: Una lista de diccionarios, cada uno representando una entrada.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return []
        with conn.cursor() as cur:
            cur.execute("SELECT id, content, result, author, is_cryptogram, user_id FROM entries;")
            entries = cur.fetchall()
        conn.close()
        return [{
            'id': entry[0],
            'content': entry[1],
            'result': entry[2],
            'author': entry[3],
            'is_cryptogram': entry[4],
            'timestamp': entry[5],
            'user_id': entry[6]
        } for entry in entries]
    except psycopg2.Error as e:
        logging.error(f"Error al obtener todas las entradas: {e}")
        return []