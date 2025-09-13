#-------------------- Archivo: crypto_generator.py ------------------------------
#-------------------- Genera los criptogramas ---------------------------------
#-------------------- Delega la persistencia a los gestores --------------------

# backend/services/crypto_generator.py
import logging
from . import gemini
from backend.core import database_manager

async def generate_and_save(data: dict):
    """
    Genera un criptograma usando la API de Gemini y guarda el resultado.
    """
    try:
        phrase = data.get('phrase')
        user_id = data.get('user_id')
        
        if not phrase or not user_id:
            return {"error": "Phrase and User ID are required."}, 400
        
        # 1. Llama a la lógica real de la API de Gemini
        cryptogram, status = await gemini.generate_cryptogram(phrase)
    
        if status != 200:
            logging.error(f"Error de la API de Gemini: {cryptogram}")
            return cryptogram, status

        # 2. Prepara los datos para PostgreSQL
        entry_data = {
            'content': phrase,
            'result': cryptogram,
            'author': None,
            'is_cryptogram': True,
            'user_id': user_id,
        }
        
        # 3. Guarda en PostgreSQL
        database_manager.create_new_entry(entry_data)
        
        # 4. Devuelve la respuesta final
        return {"cryptogram": cryptogram}, 200
            
    except Exception as e:
        logging.exception("Error al generar y guardar el criptograma.")
        return {"error": "An unexpected error occurred."}, 500