#------------------------- Archivo: "utils.py"-----------------------------------
#--------------------- decorador genérico para el retroceso exponencial. ------------------------
#----------------------- Este código es completamente reutilizable y no tiene nada que ver con la API de Gemini.

# backend/services/utils.py
import asyncio
import logging
import re
from functools import wraps

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def _sanitize_log_message(msg: str) -> str:
    """
    Busca y reemplaza la API key en un mensaje de log para evitar exponerla.
    """
    # Patrón para encontrar 'key=' seguido de una secuencia de caracteres que no son espacio o comilla
    return re.sub(r"key=([A-Za-z0-9_.-]+)", "key=REDACTED", msg)

def retry_with_exponential_backoff(max_retries=3, initial_wait_time=2):
    """
    Un decorador que implementa reintentos con retroceso exponencial para funciones asíncronas.
    Ahora sanitiza los mensajes de error para no exponer la API key.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for i in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    # Sanitizamos el mensaje de error antes de registrarlo
                    sanitized_error = _sanitize_log_message(str(e))
                    
                    if i < max_retries - 1:
                        wait_time = initial_wait_time * (2 ** i)
                        logging.warning(f"Error al ejecutar '{func.__name__}'. Reintentando en {wait_time} segundos... ({sanitized_error})")
                        await asyncio.sleep(wait_time)
                    else:
                        logging.error(f"Fallo al ejecutar '{func.__name__}' después de {max_retries} reintentos. Error final: {sanitized_error}")
                        raise e # Volvemos a lanzar la excepción original
        return wrapper
    return decorator