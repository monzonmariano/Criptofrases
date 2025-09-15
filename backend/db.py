#--------------------- Archivo : db.py --------------------------
# Este archivo solo tiene la responsabilidad de crear la conexión a la base de datos.

import os
import psycopg2
from backend.logger_config import log
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

def get_db_connection():
    """
    Establece una conexión a la base de datos PostgreSQL usando variables de entorno.
    """
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        return conn
    except psycopg2.Error as e:
        log.error(f"Error al conectar a la base de datos: {e}")
        return None
