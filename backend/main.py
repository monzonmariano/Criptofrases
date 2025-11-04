# backend/main.py (Versión Final Limpia)
from backend.logger_config import log
import asyncio
from aiohttp import web
from backend import api
import debugpy
import aiohttp_cors


async def start_server():
    # --- INICIO DEL CÓDIGO DE DEPURACIÓN -------
    
    #---- Descomentar las siguientes 4 lineas de codigo para el modo depuracion ----
    #debugpy.listen(("0.0.0.0", 5678))
    #log.info("✅ Depurador escuchando en el puerto 5678. Esperando conexión...")
    #debugpy.wait_for_client()
    #log.info("🔌 Depurador conectado.")

    # --- FIN DEL CÓDIGO DE DEPURACIÓN ---
    try:
        app = web.Application()
        api.setup_routes(app)

        # ------------------------------------------------------------------
        # --- BLOQUE DE CÓDIGO CORREGIDO PARA EL MANEJO DE CORS ---
        # ------------------------------------------------------------------
        cors_options = aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
            # Es crucial que OPTIONS esté aquí para el "preflight"
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        )

        cors = aiohttp_cors.setup(app, defaults={
            # 1. Origen local más común (localhost)
            "http://localhost:5173": cors_options,
            
            # 2. Origen local alternativo (127.0.0.1) -> ¡EL ARREGLO CLAVE!
            "http://127.0.0.1:5173": cors_options, 
            
            # 3. Tu dominio de producción
            "https://criptofrases.netlify.app": cors_options,
        })

        # Aplicamos la configuración CORS a TODAS las rutas registradas
        for route in list(app.router.routes()):
            cors.add(route)
        # ------------------------------------------------------------------
        
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 8080)
        await site.start()
        log.info(f"Servidor de Backend iniciado en http://localhost:8080")
        
        await asyncio.Event().wait()
    except Exception as e:
        log.exception("Error fatal al iniciar el servidor.")


if __name__ == '__main__':
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        log.info("Servidor detenido.")