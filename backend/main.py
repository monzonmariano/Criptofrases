#------------ Archivo : "app.py"------------------------
# --------------- EL DIRECTOR DE ORQUESTA ----------------------

# backend/app.py
import os
import asyncio
import logging
from aiohttp import web
from dotenv import load_dotenv

# Cargar las variables de entorno ANTES de importar otros módulos
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# --- CONFIGURACIÓN DE LOGGING MEJORADA ---
# 1. Creamos un formateador de logs personalizado
class CustomPathFormatter(logging.Formatter):
    def format(self, record):
        # Obtenemos la ruta del directorio personal del usuario
        # y la reemplazamos con '~' para acortar el path
        record.pathname = record.pathname.replace(os.path.expanduser('~'), '~', 1)
        return super().format(record)

# 2. Definimos el formato y aplicamos el formateador personalizado
log_format = '%(asctime)s - %(name)s - %(levelname)s - [%(pathname)s:%(lineno)d] - %(message)s'
formatter = CustomPathFormatter(log_format)

# 3. Configuramos el manejador de la consola con el nuevo formato
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

# 4. Configuramos el logger raíz para usar nuestro manejador
logging.basicConfig(level=logging.INFO, handlers=[console_handler])

# --- FIN DE CONFIGURACIÓN DE LOGGING ---

# Ahora importamos los módulos de nuestra aplicación
from backend import api

async def index_handler(request):
    """
    Maneja la solicitud a la ruta raíz y sirve el archivo index.html.
    """
    return web.FileResponse(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build', 'index.html'))

async def start_server():
    """
    Inicia el servidor web, configurando las rutas.
    """
    try:
        app = web.Application()
        api.setup_routes(app)
        
        app.router.add_get('/', index_handler)
        app.router.add_static('/static', path=os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build', 'static'), name='static')

        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, 'localhost', 8080)
        await site.start()
        logging.info("Servidor iniciado en http://localhost:8080")
        
        await asyncio.Event().wait()

    except Exception as e:
        logging.exception("Error fatal al iniciar el servidor.")

if __name__ == '__main__':
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        logging.info("Servidor detenido.")