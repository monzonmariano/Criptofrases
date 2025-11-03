# backend/services/local_author_finder.py
from backend.core.crud import quotes_crud
from backend.logger_config import log

async def find_author_locally(data: dict):
    """
    Lógica de negocio para buscar un autor localmente.
    """
    phrase = data.get('phrase', '').strip() # .strip() limpia espacios en blanco
    if not phrase:
        return {"error": "La frase no puede estar vacía."}, 400
    
    log.info(f"Servicio local_author_finder: Buscando autor para: '{phrase}'")
    
    # Llama a la capa CRUD para hacer la búsqueda
    result = await quotes_crud.find_author_by_keyword(phrase)
    
    if result:
        # ¡Éxito!
        return result, 200
    else:
        # No se encontró
        return {"error": "No se encontró un autor para esa frase en la base de datos local."}, 404