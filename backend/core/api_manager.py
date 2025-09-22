#-------------------- Archivo: api_manager.py ------------------------------
#------------------ Orquestador de la lógica del negocio ------------------
# Es el Director de Orquesta de la lógica de negocio.
# Recibe la solicitud de la capa de API (api.py)
# y la delega a los archivos de servicio (crypto_solver, crypto_generator, etc.).
# No tiene lógica de negocio propia.

# backend/core/api_manager.py
from backend.logger_config import log
from backend.services import crypto_solver, author_finder, crypto_generator
from . import database_manager

async def solve_cryptogram(data):
    """
    ORQUESTADOR: Delega la resolución de un criptograma al servicio correspondiente.
    """
    log.info("API Manager: Petición de resolución recibida. Delegando a crypto_solver.")
    return await crypto_solver.solve_and_save(data)

async def get_author_of_phrase(data):
    """
    ORQUESTADOR: Delega la búsqueda de autor al servicio correspondiente.
    """
    log.info("API Manager: Petición de autor recibida. Delegando a author_finder.")
    return await author_finder.find_and_save(data)

async def generate_cryptogram(data):
    """
    ORQUESTADOR: Delega la generación de un criptograma al servicio correspondiente.
    """
    log.info("API Manager: Petición de generación recibida. Delegando a crypto_generator.")
    return await crypto_generator.generate_and_save(data)


async def get_history_by_user(user_id):
    entries = database_manager.get_user_history(user_id)
    if entries is not None:
        for entry in entries:
            if 'timestamp' in entry and hasattr(entry['timestamp'], 'isoformat'):
                entry['timestamp'] = entry['timestamp'].isoformat()
        return {'history': entries}, 200
    else:
        return {'error': 'Failed to retrieve history.'}, 500

async def clear_user_history(user_id):
    if database_manager.clear_all_entries(user_id):
        return {'message': 'History cleared successfully.'}, 200
    else:
        return {'error': 'Failed to clear history.'}, 500

async def delete_entry_from_history(entry_id, user_id):
    if database_manager.delete_existing_entry(entry_id, user_id):
        return {'message': 'Entry deleted successfully.'}, 200
    else:
        return {'error': 'Failed to delete entry.'}, 500