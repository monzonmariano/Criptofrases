#----------------------------- Archivo : "read.py" ------------------------------
#---------------------------- Lee datos en la tabla ------------------------------

import psycopg2
import logging
from backend import db

def get_entries_by_user(user_id):
    """
    Recupera las entradas de un usuario. Para las resoluciones, extrae
    un resumen del JSON 'details' para mostrar en la lista.
    """
    try:
        conn = db.get_db_connection()
        if conn is None:
            return []
        with conn.cursor() as cur:
            # Pedimos todas las columnas necesarias
            query = """
                SELECT id, entry_type, details, timestamp, content, result
                FROM entries
                WHERE user_id = %s
                ORDER BY timestamp DESC;
            """
            cur.execute(query, (user_id,))
            entries = cur.fetchall()
        conn.close()
        
        processed_entries = []
        for entry in entries:
            details = entry[2] # El objeto JSON
            entry_data = {
                'id': entry[0],
                'entry_type': entry[1],
                'details': details,
                'created_at': entry[3].isoformat() if entry[3] else None,
                # Añadimos content y result para la vista previa
                'content': entry[4],
                'result': entry[5]
            }
            
            # Si el tipo de entrada es de los que ve el usuario, lo procesamos
            if entry_data['entry_type'] in ['solver', 'user_generator']:
                 # Aseguramos que 'is_cryptogram' exista para el frontend
                entry_data['is_cryptogram'] = True # O una lógica más compleja si es necesario

                # Si por alguna razón el resumen no está, lo extraemos del JSON
                if not entry_data['result'] and details and 'solutions' in details:
                    entry_data['result'] = details['solutions'][0]['solution']
                if not entry_data['content'] and details and 'cryptogram_str' in details:
                    entry_data['content'] = details['cryptogram_str']
            
            processed_entries.append(entry_data)
            
        return processed_entries
    except psycopg2.Error as e:
        logging.error(f"Error al obtener las entradas del usuario: {e}")
        return []