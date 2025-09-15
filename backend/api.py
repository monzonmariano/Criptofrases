#---------------------- Archivo : "api.py" ------------------------------
#----------------------- Enrutador y Controlador --------------------
#--------------- Es la "conexión" con el mundo exterior (los clientes web) a través de sus rutas definidas
#--------------- Su única función es definir las rutas: "/api/solve" /api/author" "/api/generate"
# --------------- "/api/history" "/api/clear-history" "/api/delete-entry"
#---------------  y luego pasar los datos al siguiente nivel. No tiene lógica de negocio.

from backend.logger_config import log
from aiohttp import web
from backend.core import api_manager

async def handle_solve(request):
    """Maneja las solicitudes para resolver un criptograma."""
    try:
        data = await request.json()
        response_data, status = await api_manager.solve_cryptogram(data)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/solve.")
        return web.json_response({'error': str(e)}, status=500)

async def handle_get_author(request):
    """Maneja las solicitudes para obtener el autor de una frase."""
    try:
        data = await request.json()
        response_data, status = await api_manager.get_author_of_phrase(data)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/author.")
        return web.json_response({'error': str(e)}, status=500)

async def handle_generate(request):
    """Maneja las solicitudes para generar un criptograma."""
    try:
        data = await request.json()
        response_data, status = await api_manager.generate_cryptogram(data)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/generate.")
        return web.json_response({'error': str(e)}, status=500)

async def get_history(request):
    """Maneja las solicitudes para obtener el historial de un usuario."""
    try:
        user_id = request.query.get('user_id')
        response_data, status = await api_manager.get_history_by_user(user_id)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/history.")
        return web.json_response({'error': str(e)}, status=500)

async def clear_history(request):
    """Maneja las solicitudes para borrar el historial de un usuario."""
    try:
        data = await request.json()
        user_id = data.get('user_id')
        response_data, status = await api_manager.clear_user_history(user_id)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/clear-history.")
        return web.json_response({'error': str(e)}, status=500)

async def delete_entry(request):
    """Maneja las solicitudes para eliminar una entrada del historial."""
    try:
        data = await request.json()
        entry_id = data.get('entry_id')
        user_id = data.get('user_id')
        response_data, status = await api_manager.delete_entry_from_history(entry_id, user_id)
        return web.json_response(response_data, status=status)
    except Exception as e:
        log.exception("Error en la ruta /api/delete-entry.")
        return web.json_response({'error': str(e)}, status=500)


def setup_routes(app):
    """Configura las rutas para la aplicación web."""
    app.router.add_post('/api/solve', handle_solve)
    app.router.add_post('/api/author', handle_get_author)
    app.router.add_post('/api/generate', handle_generate)
    app.router.add_get('/api/history', get_history)
    app.router.add_post('/api/clear-history', clear_history)
    app.router.add_post('/api/delete-entry', delete_entry)