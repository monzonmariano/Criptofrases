#-------------------- Archivo: api_manager.py ------------------------------
#------------------ Orquestador de la lógica del negocio ------------------
# Es el Director de Orquesta de la lógica de negocio.
# Recibe la solicitud de la capa de API (api.py)
# y la delega a los archivos de servicio (crypto_solver, crypto_generator, etc.).
# No tiene lógica de negocio propia.

# backend/core/api_manager.py
from backend.logger_config import log
from backend.services import crypto_solver, local_author_finder, crypto_generator
from . import database_manager
from backend.services import sudoku_service

async def solve_cryptogram(data):
    """
    ORQUESTADOR: Delega la resolución de un criptograma al servicio correspondiente.
    """
    log.info("API Manager: Petición de resolución recibida. Delegando a crypto_solver.")
    return await crypto_solver.solve_and_save(data)


def generate_cryptogram(data):
    """
    ORQUESTADOR: Delega la generación de un criptograma al servicio correspondiente.
    """
    log.info("API Manager: Petición de generación recibida. Delegando a crypto_generator.")
    return  crypto_generator.generate_and_save(data)


async def get_history_by_user(user_id):
    """
    ORQUESTADOR: Obtiene el historial (entradas + sudoku).
    """
    history_data = database_manager.get_user_history(user_id)
    
    if history_data is not None:
        # Formateamos las timestamps de las entradas completadas
        for entry in history_data.get('completed_entries', []):
            if 'timestamp' in entry and hasattr(entry['timestamp'], 'isoformat'):
                entry['timestamp'] = entry['timestamp'].isoformat()
        
        # Formateamos la timestamp del Sudoku (si existe)
        active_sudoku = history_data.get('active_sudoku')
        if active_sudoku and 'last_played' in active_sudoku and hasattr(active_sudoku['last_played'], 'isoformat'):
            active_sudoku['last_played'] = active_sudoku['last_played'].isoformat()

        return {'history': history_data}, 200
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
    
async def generate_cryptogram_from_user(data):
    """
    ORQUESTADOR: Delega la creación de un criptograma personalizado.
    """
    log.info("API Manager: Petición de generación personalizada recibida.")
    return await crypto_generator.generate_from_user_input(data)    

async def find_local_author(data):
    """
    ORQUESTADOR: Delega la búsqueda de autor local al servicio correspondiente.
    """
    log.info("API Manager: Petición de autor local recibida. Delegando a local_author_finder.")
    return await local_author_finder.find_author_locally(data)

def generate_sudoku(data):
    """
    ORQUESTADOR: Delega la generación de Sudoku.
    """
    log.info("API Manager: Petición de generación de Sudoku recibida.")
    difficulty = data.get('difficulty', 0.5) # Dificultad por defecto
    return sudoku_service.generate_new_sudoku(difficulty)

async def solve_sudoku(data):
    """
    ORQUESTADOR: Delega la resolución de Sudoku (algoritmo propio).
    """
    log.info("API Manager: Petición de resolución de Sudoku (propio) recibida.")
    return await sudoku_service.solve_sudoku_from_scratch(data)

async def save_sudoku_game_data(data):
    """
    ORQUESTADOR: Delega el guardado de un juego de Sudoku.
    """
    user_id = data.get('user_id')
    board_state = data.get('game_state') # Esperamos un objeto
    
    if not all([user_id, board_state, 
                'board' in board_state, 
                'originalBoard' in board_state, 
                'solution' in board_state]):
        return {'error': 'Datos de Sudoku incompletos.'}, 400

    log.info(f"API Manager: Petición de guardado de Sudoku para {user_id}")
    
    success = database_manager.save_sudoku_game(
        user_id,
        board_state['board'],
        board_state['originalBoard'],
        board_state['solution']
    )
    if success:
        return {'message': 'Juego guardado.'}, 200
    else:
        return {'error': 'No se pudo guardar el juego.'}, 500

async def clear_sudoku_game_data(data):
    """
    ORQUESTADOR: Delega el borrado de un juego de Sudoku.
    """
    user_id = data.get('user_id')
    if not user_id:
        return {'error': 'user_id requerido.'}, 400
        
    log.info(f"API Manager: Petición de borrado de Sudoku para {user_id}")
    success = database_manager.delete_active_sudoku(user_id)
    if success:
        return {'message': 'Juego borrado.'}, 200
    else:
        return {'error': 'No se pudo borrar el juego.'}, 500

# --- ¡MODIFICACIÓN IMPORTANTE! ---
