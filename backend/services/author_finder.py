# backend/services/author_finder.py

import logging
from . import gemini # Importamos nuestro cliente de la API de Gemini
from backend.core import database_manager
from backend.logger_config import log

async def find_and_save(data: dict):
    """
    Servicio para encontrar el autor de una frase, guardar el resultado
    y devolverlo a la API.
    """
    user_id = data.get('user_id')
    phrase = data.get('phrase', '')
    
    if not all([user_id, phrase]):
        return {"error": "user_id y phrase son requeridos."}, 400

    log.info(f"Servicio author_finder: Buscando autor para la frase del usuario {user_id}")

    try:
        # 1. Llamamos a la función que se comunica con la API de Gemini
        author, status = await gemini.find_author(phrase)
        
        # Preparamos los datos para la base de datos
        db_data = {
            'user_id': user_id,
            'content': phrase,
            'is_cryptogram': False, # Importante: marcamos que no es un criptograma
            'result': 'NO-AUTHOR-FOUND', # Valor por defecto
            'author': None # Valor por defecto
        }

        # 2. Procesamos la respuesta de Gemini
        if status == 200:
            log.info(f"Servicio author_finder: Autor encontrado -> {author}")
            db_data['result'] = phrase # El resultado es la misma frase
            db_data['author'] = author
            
            response_data = {"author": author}
            response_status = 200
        else:
            log.warning(f"Servicio author_finder: No se pudo encontrar un autor. Razón: {author}")
            # Si Gemini da un error, lo pasamos como respuesta
            response_data = {"error": author}
            response_status = status

        # 3. Guardamos la interacción en la base de datos (descomentar cuando esté lista)
        #database_manager.create_new_entry(db_data)
        
        return response_data, response_status

    except Exception as e:
        log.exception(f"Error fatal en el servicio author_finder: {e}")
        return {"error": "Ocurrió un error interno en el servidor."}, 500