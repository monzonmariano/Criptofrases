#---------------------- Archivo : "api.py" ------------------------------
#----------------------- VERSIÓN CORREGIDA Y SEGURA --------------------

import json
import functools
from backend.logger_config import log
from aiohttp import web
from backend.core import api_manager

pretty_json = functools.partial(json.dumps, ensure_ascii=False)

# --- FUNCIÓN DE AYUDA PARA MANEJO DE ERRORES CENTRALIZADO ---
def _create_error_response(e: Exception, route: str):
    """
    Registra el error real y detallado para el desarrollador, pero
    devuelve una respuesta genérica y segura al usuario.
    """
    # Registramos la excepción completa para poder depurarla.
    log.exception(f"Error fatal no controlado en la ruta {route}: {e}")
    # Creamos la respuesta genérica que no filtra ninguna información.
    error_payload = {"error": "Ocurrió un error interno en el servidor. Por favor, inténtelo de nuevo más tarde."}
    return web.json_response(error_payload, status=500, dumps=pretty_json)

#---------------------------------------CRIPTOGRAMAS SECTION -------------------------------------
async def handle_solve(request):
    try:
        data = await request.json()
        response_data, status = await api_manager.solve_cryptogram(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/solve")


async def handle_generate(request):
    try:
        data = await request.json()
        response_data, status =  api_manager.generate_cryptogram(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/generate")
    

async def handle_generate_custom(request):
    try:
        data = await request.json()
        response_data, status = await api_manager.generate_cryptogram_from_user(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/generate/custom")

async def handle_get_local_author(request):
    try:
        data = await request.json()
        response_data, status = await api_manager.find_local_author(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        return _create_error_response(e, "/api/author/local") 
    

#------------------------------------------------------------------------------------------------------

#----------------------------------- HISTORIAL SECTION ------------------------------------------------
async def get_history(request):
    try:
        user_id = request.query.get('user_id')
        response_data, status = await api_manager.get_history_by_user(user_id)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/history")

async def clear_history(request):
    try:
        data = await request.json()
        user_id = data.get('user_id')
        response_data, status = await api_manager.clear_user_history(user_id)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/clear-history")

async def delete_entry(request):
    try:
        data = await request.json()
        entry_id = data.get('entry_id')
        user_id = data.get('user_id')
        response_data, status = await api_manager.delete_entry_from_history(entry_id, user_id)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        # ¡CORREGIDO!
        return _create_error_response(e, "/api/delete-entry")

#------------------------------------------------------------------------------------------

#--------------------------------- SUDOKU SECTION ------------------------------------------      
async def handle_generate_sudoku(request):
    try:
        data = await request.json()
        response_data, status = api_manager.generate_sudoku(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        return _create_error_response(e, "/api/sudoku/generate")

async def handle_solve_sudoku(request):
    try:
        data = await request.json()
        response_data, status = await api_manager.solve_sudoku(data)
        return web.json_response(response_data, status=status, dumps=pretty_json)
    except Exception as e:
        return _create_error_response(e, "/api/sudoku/solve")

#------------------------------------------------------------------------------------------

def setup_routes(app):
    #-------------- RUTEOS PARA CRIPTOGRAMA ---------------------------
    app.router.add_post('/api/solve', handle_solve)
    app.router.add_post('/api/generate/custom', handle_generate_custom)
    app.router.add_post('/api/author/local', handle_get_local_author)
    app.router.add_post('/api/generate', handle_generate)
    #-------------- RUTEOS PARA EL HISTORIAL --------------------------
    app.router.add_get('/api/history', get_history)
    app.router.add_post('/api/clear-history', clear_history)
    app.router.add_post('/api/delete-entry', delete_entry)
    #-------------- RUTEOS PARA SUDOKU -----------------------------
    app.router.add_post('/api/sudoku/generate', handle_generate_sudoku)
    app.router.add_post('/api/sudoku/solve', handle_solve_sudoku)
  