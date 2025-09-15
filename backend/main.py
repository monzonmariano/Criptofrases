# backend/main.py (Versión Final Limpia)
from backend.logger_config import log
import asyncio
from aiohttp import web
from backend import api

async def start_server():
    try:
        app = web.Application()
        api.setup_routes(app)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 8080)
        await site.start()
        log.info(f"Servidor de Backend iniciado en http://0.0.0.0:8080")
        await asyncio.Event().wait()
    except Exception as e:
        log.exception("Error fatal al iniciar el servidor.")

if __name__ == '__main__':
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        log.info("Servidor detenido.")