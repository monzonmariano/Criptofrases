#-------------------- Archivo: author_finder.py ------------------------------
#-------------------- Encuentra el autor de una frase ----------------------
#-------------------- Delega la persistencia a los gestores --------------------

# backend/services/author_finder.py
import logging
from . import gemini
from backend.core import database_manager

async def find_and_save(data: dict):
    """
    Encuentra un autor usando la API de Gemini y guarda el resultado.
    """
    try:
        phrase = data.get('phrase')
        user_id = data.get('user_id')
        
        if not phrase or not user_id:
            return {"error": "Phrase and User ID are required."}, 400
        
        # 1. Llama a la lógica real de la API de Gemini
        author, status = await gemini.find_author(phrase)

        if status != 200:
            logging.error(f"Error de la API de Gemini: {author}")
            return author, status
        
        # 2. Prepara los datos para PostgreSQL
        entry_data = {
            'content': phrase,
            'result': author,
            'author': author,
            'is_cryptogram': False,
            'user_id': user_id,
        }
        
        # 3. Guarda en PostgreSQL
        database_manager.create_new_entry(entry_data)
        
        # 4. Devuelve la respuesta final
        return {"author": author}, 200
            
    except Exception as e:
        logging.exception("Error al encontrar y guardar el autor.")
        return {"error": "An unexpected error occurred."}, 500