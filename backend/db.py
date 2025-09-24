# backend/db.py (Versión de Depuración Final)

import os
import psycopg2
from backend.logger_config import log

def get_db_connection():
    """
    Establece y devuelve una conexión a la base de datos.
    Incluye logging detallado para depurar problemas de conexión en producción.
    """
    log.info("--- [DEBUG] Intentando obtener conexión a la base de datos... ---")
    
    try:
        db_url = os.getenv("DB_URL")
        
        # Imprimimos en los logs el valor que REALMENTE está recibiendo la aplicación.
        log.info(f"--- [DEBUG] Valor de la variable de entorno DB_URL: '{db_url}' ---")

        if db_url:
            log.info("--- [DB] Conectando a la base de datos usando DB_URL. ---")
            conn = psycopg2.connect(db_url)
            log.info("--- [DB] ¡Conexión con DB_URL exitosa! ---")
            return conn
        else:
            # Si DB_URL no existe, el programa fallará aquí y nos lo dirá.
            log.error("--- [DEBUG] ¡ERROR CRÍTICO! La variable de entorno DB_URL está vacía o no definida. La aplicación no puede continuar. ---")
            # Devolvemos None para que el resto del código maneje el error de conexión.
            return None
            
    except psycopg2.Error as e:
        log.error(f"Error fatal al intentar conectar a la base de datos: {e}")
        return None