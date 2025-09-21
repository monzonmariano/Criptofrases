#-------------------- Archivo: "database_manager.py" -----------------------
#-------------------- Este archivo es el Gestionador de Base de Datos ----------------------------
#-------------------- Llama a los archivos create.py update.py y delete.py -------------------------
# backend/core/database_manager.py (Versión Final Corregida)

from backend.core.crud import create, read, delete, update
from backend.logger_config import log

# --- CREATE ---
def create_new_entry(data):
    """
    Gestor para crear una nueva entrada en la base de datos.
    Delega la lógica a la capa CRUD.
    """
    try:
        return create.create_entry(data)
    except Exception as e:
        log.error(f"Error en el gestor al crear la entrada: {e}")
        return None

# --- READ ---
def get_user_history(user_id):
    """
    Gestor para obtener todas las entradas de un usuario.
    Delega la lógica a la capa CRUD.
    """
    try:
        return read.get_entries_by_user(user_id)
    except Exception as e:
        log.error(f"Error en el gestor al leer el historial: {e}")
        return []

# --- DELETE (UNA ENTRADA) ---
def delete_existing_entry(entry_id, user_id):
    """
    Gestor para eliminar una entrada específica de un usuario.
    Delega la lógica a la capa CRUD.
    """
    try:
        return delete.delete_entry(entry_id, user_id)
    except Exception as e:
        log.error(f"Error en el gestor al eliminar la entrada: {e}")
        return False

# --- DELETE (TODAS LAS ENTRADAS) ---
def clear_all_entries(user_id):
    """
    Gestor para borrar todas las entradas de un usuario.
    Delega la lógica a la capa CRUD.
    """
    try:
        # ¡AQUÍ ESTÁ LA CORRECCIÓN!
        # Llamamos a la función correcta para borrar todo el historial.
        return delete.delete_all_user_entries(user_id)
    except Exception as e:
        log.error(f"Error en el gestor al borrar todas las entradas: {e}")
        return False