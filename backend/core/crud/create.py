#-------------------------------- Archivo: "create.py" -------------------------------
#-------------------------- Inserta datos en la tabla ----------------------------------

#-------------------------------- Archivo: "create.py" -------------------------------
import psycopg2
import logging
from backend import db

def create_entry(data):
    """
    Inserta una nueva entrada en la tabla 'entries'.
    Maneja campos opcionales de forma segura.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return None
        with conn.cursor() as cur:
            # Usamos .get() para todos los campos para evitar errores si no están presentes
            cur.execute(
                """
                INSERT INTO entries (user_id, entry_type, content, result, author, details)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    data.get('user_id'),
                    data.get('entry_type'),
                    data.get('content'),
                    data.get('result'),
                    data.get('author'),
                    data.get('details') # Pasamos el string JSON (o None)
                )
            )
            entry_id = cur.fetchone()[0]
            conn.commit()
        conn.close()
        return entry_id
    except psycopg2.Error as e:
        logging.error(f"Error al crear la entrada: {e}")
        return None