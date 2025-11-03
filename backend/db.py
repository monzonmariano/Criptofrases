# backend/db.py (Versión Robusta)

import os
import psycopg2
from backend.logger_config import log

def get_db_connection():
    log.info("--- [DB] Intentando obtener conexión a la base de datos... ---")
    
    try:
        dbname = os.getenv("DB_NAME")
        user = os.getenv("DB_USER")
        password = os.getenv("POSTGRES_PASSWORD")
        host = os.getenv("DB_HOST")
        port = os.getenv("DB_PORT")

        if not all([dbname, user, password, host, port]):
            log.error("--- [DB] ¡ERROR CRÍTICO! Faltan variables de entorno de la BD. ---")
            return None

        log.info(f"--- [DB] Conectando a '{dbname}' en {host}:{port}... ---")
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            connect_timeout=10 # <--- Añade un timeout de 10 segundos
        )
        log.info("--- [DB] ¡Conexión exitosa! ---")
        return conn
            
    except psycopg2.Error as e:
        log.error(f"Error fatal al intentar conectar a la base de datos: {e}")
        return None