#-------------------- Archivo: api_manager.py ------------------------------
#------------------ Orquestador de la lógica del negocio ------------------
# Es el Director de Orquesta de la lógica de negocio.
# Recibe la solicitud de la capa de API (api.py)
# y la delega a los archivos de servicio (crypto_solver, crypto_generator, etc.).
# No tiene lógica de negocio propia.

import logging
from backend.services import crypto_solver, author_finder, crypto_generator
from backend.core import database_manager

async def solve_cryptogram(data):
    """
    Orquesta la resolución de un criptograma.
    Delega la validación, la lógica y la persistencia a un archivo de servicio.
    """
    return await crypto_solver.solve_and_save(data)

async def get_author_of_phrase(data):
    """
    Orquesta la búsqueda de autor.
    Delega la validación, la lógica y la persistencia a un archivo de servicio.
    """
    return await author_finder.find_and_save(data)

async def generate_cryptogram(data):
    """
    Orquesta la generación de un criptograma.
    Delega la validación, la lógica y la persistencia a un archivo de servicio.
    """
    return await crypto_generator.generate_and_save(data)

async def get_history_by_user(user_id):
    """
    Orquesta la obtención del historial de un usuario desde PostgreSQL.
    """
    entries = database_manager.get_user_history(user_id)
    
    if entries is not None:
        # Bucle para convertir cada timestamp a texto (string)
        for entry in entries:
            # psycopg2 devuelve un diccionario por cada fila, accedemos por la clave
            if 'timestamp' in entry and hasattr(entry['timestamp'], 'isoformat'):
                entry['timestamp'] = entry['timestamp'].isoformat()
        
        return {'history': entries}, 200
    else:
        return {'error': 'Failed to retrieve history.'}, 500

async def clear_user_history(user_id):
    """
    Orquesta el borrado del historial de un usuario en PostgreSQL.
    """
    if database_manager.clear_all_user_entries(user_id):
        return {'message': 'History cleared successfully.'}, 200
    else:
        return {'error': 'Failed to clear history.'}, 500

async def delete_entry_from_history(entry_id, user_id):
    """
    Orquesta el borrado de una entrada individual del historial en PostgreSQL.
    """
    if database_manager.delete_existing_entry(entry_id, user_id):
        return {'message': 'Entry deleted successfully.'}, 200
    else:
        return {'error': 'Failed to delete entry.'}, 500