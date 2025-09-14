#-------------------- Archivo: "database_manager.py" -----------------------
#-------------------- Este archivo es el Gestionador de Base de Datos ----------------------------
#-------------------- Llama a los archivos create.py update.py y delete.py -------------------------
from .crud import create, read, update, delete
import logging

def create_new_entry(data):
    """
    Crea una nueva entrada en la base de datos.
    """
    try:
        entry_id = create.create_entry(data)
        if entry_id:
            logging.info(f"Entrada creada exitosamente con ID: {entry_id}")
            return entry_id
        else:
            logging.error("No se pudo crear la entrada.")
            return None
    except Exception as e:
        logging.error(f"Error en el gestor al crear la entrada: {e}")
        return None

def get_user_history(user_id):
    """
    Obtiene todo el historial de un usuario desde la base de datos.
    """
    try:
        entries = read.get_entries_by_user(user_id)
        return entries
    except Exception as e:
        logging.error(f"Error en el gestor al obtener el historial para el usuario {user_id}: {e}")
        return []

def delete_existing_entry(entry_id, user_id):
    """
    Elimina una entrada de la base de datos por su ID y usuario.
    """
    try:
        success = delete.delete_entry(entry_id, user_id)
        if success:
            logging.info(f"Entrada con ID {entry_id} eliminada para el usuario {user_id}.")
            return True
        else:
            logging.warning(f"Fallo al eliminar la entrada con ID {entry_id} para el usuario {user_id}.")
            return False
    except Exception as e:
        logging.error(f"Error en el gestor al eliminar la entrada: {e}")
        return False

def clear_all_user_entries(user_id):
    """
    Elimina todas las entradas de un usuario de la base de datos.
    """
    try:
        success = delete.delete_entry(user_id)
        if success:
            logging.info(f"Todas las entradas para el usuario {user_id} han sido eliminadas.")
            return True
        else:
            logging.warning(f"Fallo al borrar todas las entradas para el usuario {user_id}.")
            return False
    except Exception as e:
        logging.error(f"Error en el gestor al borrar todas las entradas: {e}")
        return False